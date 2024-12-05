
// import connectToDB from "@/database";
// import AuthUser from "@/middleware/AuthUser";
// import Product from "@/models/product";
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// export async function PUT(req) {
//   try {
//     await connectToDB();

//     const isAuthUser = await AuthUser(req);

//     if (isAuthUser?.role === "admin") {
//       const extractData = await req.json();
//       const {
//         _id,
//         name,
//         price,
//         description,
//         category,
//         sizes,
//         deliveryInfo,
//         onSale,
//         priceDrop,
//         imageUrl,
//       } = extractData;

//       const updatedProduct = await Product.findOneAndUpdate(
//         {
//           _id: _id,
//         },
//         {
//           name,
//           price,
//           description,
//           category,
//           sizes,
//           deliveryInfo,
//           onSale,
//           priceDrop,
//           imageUrl,
//         },
//         { new: true }
//       );

//       if (updatedProduct) {
//         return NextResponse.json({
//           success: true,
//           message: "Product updated successfully",
//         });
//       } else {
//         return NextResponse.json({
//           success: false,
//           message: "Failed to update the product ! Please try again later",
//         });
//       }
//     } else {
//       return NextResponse.json({
//         success: false,
//         message: "You are not authenticated",
//       });
//     }
//   } catch (e) {
//     console.log(error);
//     return NextResponse.json({
//       success: false,
//       message: "Something went wrong ! Please try again later",
//     });
//   }
// }

import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Authenticate the user
    const isAuthUser = await AuthUser(req);
    if (!isAuthUser || isAuthUser.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated or authorized to perform this action",
      });
    }

    // Extract data from the request
    const {
      _id,
      name,
      price,
      description,
      category,
      sizes,
      deliveryInfo,
      onSale,
      priceDrop,
      imageUrl, // Existing image URL
      newImage, // New image to upload (base64 or URL)
    } = await req.json();

    // Initialize updated image URL with the existing one
    let updatedImageUrl = imageUrl;

    // Upload the new image to Cloudinary if provided
    if (newImage) {
      const uploadResponse = await cloudinary.uploader.upload(newImage, {
        folder: "super-mall/products", // Organize uploads in a specific folder
      });
      updatedImageUrl = uploadResponse.secure_url;
    }

    // Update the product in the database
    const updatedProduct = await Product.findOneAndUpdate(
      { _id }, // Match the product by ID
      {
        name,
        price,
        description,
        category,
        sizes,
        deliveryInfo,
        onSale,
        priceDrop,
        imageUrl: updatedImageUrl, // Set the new image URL if updated
      },
      { new: true } // Return the updated product document
    );

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        message: "Failed to update the product! Please try again later",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct, // Include updated product data in the response
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred! Please try again later",
      error: error.message,
    });
  }
}


