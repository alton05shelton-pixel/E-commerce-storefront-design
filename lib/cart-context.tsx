"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  image_url: string
  slug: string
  quantity: number
  stock_quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_CART":
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      return {
        ...state,
        items: action.payload,
        total,
        itemCount,
        isLoading: false,
      }

    case "ADD_ITEM":
      const existingItem = state.items.find((item) => item.product_id === action.payload.product_id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.stock_quantity) }
            : item,
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      }

    case "UPDATE_QUANTITY":
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const updatedItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: updatedItems,
        total: updatedTotal,
        itemCount: updatedItemCount,
      }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((item) => item.id !== action.payload)
      const filteredTotal = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const filteredItemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        ...state,
        items: filteredItems,
        total: filteredTotal,
        itemCount: filteredItemCount,
      }

    case "CLEAR_CART":
      return initialState

    default:
      return state
  }
}

interface CartContextType extends CartState {
  addToCart: (product: any, quantity?: number) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()
  const supabase = createClient()

  // Load cart from database on mount
  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Load from localStorage for guest users
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          dispatch({ type: "SET_CART", payload: cartItems })
        } else {
          dispatch({ type: "SET_CART", payload: [] })
        }
        return
      }

      // Load from database for authenticated users
      const { data: cartItems, error } = await supabase
        .from("cart_items")
        .select(
          `
          id,
          quantity,
          products (
            id,
            name,
            price,
            image_url,
            slug,
            stock_quantity
          )
        `,
        )
        .eq("user_id", user.id)

      if (error) throw error

      const formattedItems: CartItem[] =
        cartItems?.map((item: any) => ({
          id: item.id,
          product_id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image_url: item.products.image_url,
          slug: item.products.slug,
          quantity: item.quantity,
          stock_quantity: item.products.stock_quantity,
        })) || []

      dispatch({ type: "SET_CART", payload: formattedItems })
    } catch (error) {
      console.error("Error loading cart:", error)
      dispatch({ type: "SET_CART", payload: [] })
    }
  }

  const addToCart = async (product: any, quantity = 1) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const cartItem: CartItem = {
        id: `temp-${Date.now()}`,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        slug: product.slug,
        quantity,
        stock_quantity: product.stock_quantity,
      }

      if (!user) {
        // Save to localStorage for guest users
        dispatch({ type: "ADD_ITEM", payload: cartItem })
        const updatedItems = [...state.items]
        const existingIndex = updatedItems.findIndex((item) => item.product_id === product.id)
        if (existingIndex >= 0) {
          updatedItems[existingIndex].quantity = Math.min(
            updatedItems[existingIndex].quantity + quantity,
            product.stock_quantity,
          )
        } else {
          updatedItems.push(cartItem)
        }
        localStorage.setItem("cart", JSON.stringify(updatedItems))
      } else {
        // Save to database for authenticated users
        const { error } = await supabase.from("cart_items").upsert(
          {
            user_id: user.id,
            product_id: product.id,
            quantity,
          },
          {
            onConflict: "user_id,product_id",
          },
        )

        if (error) throw error
        await loadCart()
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (quantity <= 0) {
        await removeFromCart(id)
        return
      }

      if (!user) {
        // Update localStorage for guest users
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
        const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
        localStorage.setItem("cart", JSON.stringify(updatedItems))
      } else {
        // Update database for authenticated users
        const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id)

        if (error) throw error
        await loadCart()
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = async (id: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Remove from localStorage for guest users
        dispatch({ type: "REMOVE_ITEM", payload: id })
        const updatedItems = state.items.filter((item) => item.id !== id)
        localStorage.setItem("cart", JSON.stringify(updatedItems))
      } else {
        // Remove from database for authenticated users
        const { error } = await supabase.from("cart_items").delete().eq("id", id)

        if (error) throw error
        await loadCart()
      }

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Clear localStorage for guest users
        localStorage.removeItem("cart")
      } else {
        // Clear database for authenticated users
        const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)
        if (error) throw error
      }

      dispatch({ type: "CLEAR_CART" })
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
