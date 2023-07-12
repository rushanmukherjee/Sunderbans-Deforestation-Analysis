var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[88.23215756023906, 22.164375317717916],
          [88.23215756023906, 21.47082196140555],
          [89.12754330242656, 21.47082196140555],
          [89.12754330242656, 22.164375317717916]]], null, false);
/// Geometry has been drawn

/// Define bands of interest here 

var L8bands = ['B2','B3','B4']

var L7bands =['B3']

var L5bands = ['B3']


///////// Visualisation parameters
var L8vis = {
  bands: L8bands,
  min: 0,
  max: 0.5,

};


var L7vis = {
  bands: L7bands,
  min: 0,
  max: 0.5,
  //gamma: [0.95, 1.1, 1]
};


var L5vis = {
  bands: L5bands,
  min: 0,
  max: 0.5,
  //gamma: [0.95, 1.1, 1]
};

//mask clouds
function maskLandsatclouds(image) {
  var qa = image.select('BQA')
  var cloudBitMask = ee.Number(2).pow(4).int()
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
  return image.updateMask(mask)
      .select("B.*")
      .copyProperties(image, ["system:time_start"])
}


//Landsat 5 TM, available from 1984-2012
//1985-1986
var L5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_TOA") 
  .filterDate('1985-01-01', '1989-12-30') // you can change date here
  .filter(ee.Filter.lt("CLOUD_COVER", 0.5))
  .filterBounds(geometry)
  .map(maskLandsatclouds)
  .select(L5bands)
  
var mosaic_L5 = L5.median().clip(geometry); // here we are taking the median at each pixel in the collection
Map.addLayer(mosaic_L5, L5vis, "mosaic_L5")




//Landsat 7, available from 1999. 
//Nb striping is due to the scan line corrector
// on the satellite failing, median compositor smooths that out but be aware
var L7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_TOA")
  .filterDate('2000-01-01', '2001-12-30') // you can change date here
  .filter(ee.Filter.lt("CLOUD_COVER", 0.5))
  .filterBounds(geometry)
  .map(maskLandsatclouds)
  .select(L7bands)
  
var mosaic_L7 = L7.median().clip(geometry); // here we are taking the median at each pixel in the collection
Map.addLayer(mosaic_L7, L7vis, "mosaic_L7")



//Landsat 8. Avalable from 2013
////2017-2018
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA") 
  .filterDate('2019-01-01', '2020-01-01') // you can change date here
  .filter(ee.Filter.lt("CLOUD_COVER", 0.5))
  .filterBounds(geometry)
  .map(maskLandsatclouds)
  .select(L8bands)


var best = ee.Image(L5.sort('CLOUD_COVER').first());

//print('Least Cloudy Image is ', best);



//get specific metadata from image

var date_taken = best.get('DATE_ACQUIRED');
print('Date taken is', date_taken);

  
var mosaic_L8 = L8.median().clip(geometry); // here we are taking the median at each pixel in the collection
Map.addLayer(mosaic_L8, L8vis, "mosaic_L8")

Map.centerObject(geometry)

//Print the area of the selected mosaic
// Print polygon area in square kilometers
print('Polygon area in square km : ', geometry.area(10).divide(1000 * 1000));

// Print polygon perimeter length in kilometers.
print('Polygon perimeter: ', geometry.perimeter(10).divide(1000));

//// For Exporting mosaic images to drive


Export.image.toDrive({ 
  image: mosaic_L5, /// To choose which imagery to export change the number (e.g. L5, L7 or L8)
  description: 'L_RED_band',  //give correct name
  scale: 30, 
  maxPixels: 1e13, 
  region: geometry 
});

Export.image.toDrive({ 
  image: mosaic_L8, /// To choose which imagery to export change the number (e.g. L5, L7 or L8)
  description: 'L7_RED_band',  //give correct name
  scale: 30, 
  maxPixels: 1e13, 
  region: geometry 
});



Export.image.toDrive({ 
  image: mosaic_L8, /// To choose which imagery to export change the number (e.g. L5, L7 or L8)
  description: 'L8_RGB_new',  //give correct name
  scale: 30, 
  maxPixels: 1e13, 
  region: geometry 
});
