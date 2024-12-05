// import connectToDB from "@/database";
// import AuthUser from "@/middleware/AuthUser";
// import Product from "@/models/product";
// import Joi from "joi";
// import { NextResponse } from "next/server";

// const AddNewProductSchema = Joi.object({
//   name: Joi.string().required(),
//   description: Joi.string().required(),
//   price: Joi.number().required(),
//   category: Joi.string().required(),
//   sizes: Joi.array().required(),
//   deliveryInfo: Joi.string().required(),
//   onSale: Joi.string().required(),
//   priceDrop: Joi.number().required(),
//   imageUrl: Joi.string().required(),
// });

// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   try {
//     await connectToDB();

//     const isAuthUser = await AuthUser(req)

//     console.log(isAuthUser , 'sangam');

//     if (isAuthUser?.role === "admin") {
//       const extractData = await req.json();

//       const {
//         name,
//         description,
//         price,
//         imageUrl,
//         category,
//         sizes,
//         deliveryInfo,
//         onSale,
//         priceDrop,
//       } = extractData;

//       const { error } = AddNewProductSchema.validate({
//         name,
//         description,
//         price,
//         imageUrl,
//         category,
//         sizes,
//         deliveryInfo,
//         onSale,
//         priceDrop,
//       });

//       if (error) {
//         return NextResponse.json({
//           success: false,
//           message: error.details[0].message,
//         });
//       }

//       const newlyCreatedProduct = await Product.create(extractData);

//       if (newlyCreatedProduct) {
//         return NextResponse.json({
//           success: true,
//           message: "Product added successfully",
//         });
//       } else {
//         return NextResponse.json({
//           success: false,
//           message: "Failed to add the product ! please try again",
//         });
//       }
//     } else {
//       return NextResponse.json({
//         success: false,
//         message: "You are not autorized !",
//       });
//     }
//   } catch (error) {
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
import Joi from "joi";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

// Define the schema for product validation
const AddNewProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().items(Joi.string()).required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.boolean().required(),
  priceDrop: Joi.number().required(),
  imageUrl: Joi.string().allow("").optional(), // Image URL is optional initially
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Authenticate the user
    // const isAuthUser = await AuthUser(req);
    // if (!isAuthUser || isAuthUser.role != "admin") {
    //   return NextResponse.json({
    //     success: false,
    //     message: "You are not authorized to perform this action.",
    //   });
    // }

    // Extract data from the request
    const extractData = await req.json();
    const {
      name,
      description,
      price,
      imageUrl, // This is the raw file URL or base64 string for the image
      category,
      sizes,
      deliveryInfo,
      onSale,
      priceDrop,
    } = extractData;

    // Validate the product data (excluding the image initially)
    const { error } = AddNewProductSchema.validate({
      name,
      description,
      price,
      category,
      sizes,
      deliveryInfo,
      onSale,
      priceDrop,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: `Validation Error: ${error.details[0].message}`,
      });
    }

    // Upload the image to Cloudinary if provided
    let uploadedImageUrl = "";
    if (imageUrl) {
      const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
        folder: "super-mall/products", // Organize uploads in a folder
        resource_type: "image", // Explicitly set resource type
      });

      if (!uploadResponse || !uploadResponse.secure_url) {
        return NextResponse.json({
          success: false,
          message: "Failed to upload the image to Cloudinary.",
        });
      }

      uploadedImageUrl = uploadResponse.secure_url;
    }

    // Add the Cloudinary URL to the product data
    const productData = {
      name,
      description,
      price,
      category,
      sizes,
      deliveryInfo,
      onSale,
      priceDrop,
      imageUrl: uploadedImageUrl, // Use the Cloudinary URL
    };

    // Save the new product to the database
    const newlyCreatedProduct = await Product.create(productData);

    if (!newlyCreatedProduct) {
      return NextResponse.json({
        success: false,
        message: "Failed to add the product! Please try again.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product added successfully!",
      product: newlyCreatedProduct, // Return the created product details
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred! Please try again later.",
      error: error.message,
    });
  }
}


