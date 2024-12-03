const productModel = require("../models/product.model");
const supabase = require("../config/superbase.config"); // Import Supabase configuration

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const { originalname, buffer, mimetype } = file;

      // Upload file to Supabase storage
      const filePath = `products/${Date.now()}_${originalname}`;
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .upload(filePath, buffer, { contentType: mimetype });

      if (error) {
        console.error("File upload error:", error.message);
        return res
          .status(500)
          .json({ message: "File upload failed", error: error.message });
      }

      console.log("Upload Success:", data);

      // Get public URL of the uploaded file
      const { data: publicURLData, error: urlError } = supabase.storage
        .from(process.env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(filePath);

      if (urlError || !publicURLData.publicUrl) {
        console.error(
          "Error getting public URL:",
          urlError ? urlError.message : "Invalid URL"
        );
        continue; // Skip to the next file
      }
      console.log("Public URL:", publicURLData.publicUrl);

      // Add the public URL to the uploaded files array
      uploadedFiles.push(publicURLData.publicUrl);
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No valid files were uploaded" });
    }

    // Save the product to the database
    const product = await productModel.create({
      name,
      description,
      price,
      images: uploadedFiles,
      seller: req.user._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    next(error);
  }
};

