import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import Form from './Form';


export default function FormCard() {
  return (
    <Card className="w-[60%] mt-4">
      <CardHeader>
        <CardTitle>NIP</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <Form />
      </CardContent>
    </Card>
  )
}
