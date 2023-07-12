# Sunderbans-Deforestation-Analysis
This project was completed as part of my bachelor thesis with another colleague. We investigate the percentage of forest cover in the mangrove forests of India(Sunderbans) using Landsat satellite images and unsupervised pixel classification. 
To re-create the results, one must first get access to Google Earth Engine. Using the GEE script provided in this repository, one can download the images. 
These raw images need to be pre-processed using the NDVI method in QGIS software. NDVI or Normalised Difference Vegetation Index specifically highlights areas where there are more trees, forests and shrubs. 
Further, use the python script to perform k-means unsupervised classification on the obtained images to get the forest cover percentage. 
