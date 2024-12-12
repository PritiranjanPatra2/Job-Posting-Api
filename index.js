import express from "express";
import mongoose from "mongoose";
import JobModel from "./jobmodel.js";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT;
const URL = process.env.URL;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
  try{
    const jobs = await JobModel.find();
    res.json({
        message: "Jobs fetched successfully",
        jobs: jobs
    });
    } catch (err) {
        res.status(500).json({ message: err.message });
    
  }
});
app.post("/job", async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    const job = new JobModel({
      title: title,
      description: description,
      company: company,
      location: location,
      salary: salary,
    });
    await job.save();
    res.status(201).send({
      message: "Job added successfully",
      job: job,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
app.put('/edit/:id',async (req,res)=>{
    try{
        const id = req.params.id;
        const {title,description,company,location,salary} = req.body;
        const job = await JobModel.findById(id);
        job.title = title;
        job.description = description;
        job.company = company;
        job.location = location;
        job.salary = salary;
        await job.save();
        res.send({
            message:"Job updated successfully",
            job:job
        });
    } catch (err) {
        res.status(500).send(err);

    }
})
app.delete('/delete/:id',async (req,res)=>{
    try{
        const id = req.params.id;
        const job = await JobModel.findByIdAndDelete(id);
        res.send({
            message:"Job deleted successfully",
            job:job
        });
    } catch (err) {
        res.status(500).send(err);

    }
})
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Failed to connect to MongoDB");
  });
