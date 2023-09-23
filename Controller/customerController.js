const CustomerModel =require("../Model/userModel") 
const productModel = require("../Model/productModel")

const addToCart = async(req,res)=>{
    try {
      const productId = req.params.id
      const product =  await productModel.findById(productId)
      if (!product ){
        return res.status(404).json({msg:"product not found"})
      }
      const customerId = req.user._id;

      // Find the customer based on their ID
      const customer = await CustomerModel.findById(customerId);
  
      if (!customer) {
        return res.status(404).json({ msg: "Customer not found" });
      }

      const item = {
        product :{
            product: product._id,
            name: product.Name,
            description: product.Description,
            price: product.Price,
        },
        quantity: 1, // You can specify the quantity as needed
      }

      customer.shoppingCart.push(item.product )
      await customer.save()
      res.status(200).json({msg:"successfully add"})



    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}


const getAllItem = async(req,res)=>{
try {
    const customerId =  req.user._id

    let customer = await CustomerModel.findById(customerId)
    if (!customer){
        return res.status(404).json({msg:"customer not found"})
    }

    const items = customer.shoppingCart
    res.status(200).json(items)
} catch (error) {
    console.error(error)
    res.status(500).send("Internal Error")
}
}


const deleteItem = async(req,res)=>{
    try {
        let itemId = req.params.id
        const customerId = req.user._id
        let customer = await CustomerModel.findById(customerId)
        if(!customer){
            return res.status(404).json({msg:"customer not found"})
        }

       customer.shoppingCart = customer.shoppingCart.filter((item)=> item.product.toString() !== itemId) 
        await customer.save()
            res.json({msg : "deleted success"})
        
        } catch (error) {
        console.error(error)
        res.status(500).send("Internal Error")
    }
}





module.exports={
addToCart,
getAllItem,
deleteItem,
}