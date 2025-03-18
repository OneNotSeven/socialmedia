"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const VerificationPage=()=> {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Application Submitted</AlertTitle>
          <AlertDescription className="text-green-700">
            Your verification request has been submitted successfully. We'll review your application and get back to you
            within 5-7 business days.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Verification Application</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Official Process
            </Badge>
          </div>
          <CardDescription>Apply for a verified badge to confirm the authenticity of your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="@yourusername" required />
                <p className="text-sm text-muted-foreground">Enter your exact username as it appears on your profile</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Your full legal name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
                <p className="text-sm text-muted-foreground">We'll send verification updates to this email</p>
              </div>

              <div className="space-y-2">
                <Label>Account Category</Label>
                <RadioGroup defaultValue="individual" className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-normal">
                      Individual/Public Figure
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="font-normal">
                      Business/Organization
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="media" id="media" />
                    <Label htmlFor="media" className="font-normal">
                      Media/News Outlet
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why should this account be verified?</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why your account meets our verification criteria..."
                  className="min-h-[120px]"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Describe your notability and why verification is important for your account
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-upload">Upload Identification</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input
                    id="id-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, application/pdf"
                    required
                  />
                  <Label htmlFor="id-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Government-issued ID or official business documents (PDF, JPG, PNG)
                    </p>
                    {files.length > 0 && (
                      <div className="mt-3 text-sm font-medium text-blue-600">{files.length} file(s) selected</div>
                    )}
                  </Label>
                </div>
              </div>

              <Alert variant="default" className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 text-sm font-medium">Important</AlertTitle>
                <AlertDescription className="text-amber-700 text-sm">
                  Submitting false information may result in permanent account suspension. All information provided will
                  be verified.
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="terms" required />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
                    I confirm that all information provided is accurate and I have read the{" "}
                    <a href="#" className="text-primary underline">
                      verification guidelines
                    </a>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Verification Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default VerificationPage