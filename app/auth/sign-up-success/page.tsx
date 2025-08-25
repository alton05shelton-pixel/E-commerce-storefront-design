import Link from "next/link"
import { CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-10 bg-muted/20">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We've sent you a confirmation link to complete your registration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <Mail className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Please check your email and click the confirmation link to activate your account.
              </p>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
