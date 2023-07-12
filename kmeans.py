#import libraries
import cv2
import matplotlib.pyplot as plt
from google.colab.patches import cv2_imshow
from sklearn.cluster import KMeans
from collections import Counter
from sklearn import preprocessing

#import image
img = cv2.imread("/content/NDVI Sundarbans 2019.jpg")
img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
#cv2_imshow(img)

#resize image
img = cv2.GaussianBlur(img,(5,5),0)
img= cv2.resize(img,(224,224))
mod_img = img.reshape(img.shape[0]*img.shape[1],3)

#define classifier
classifier =KMeans(n_clusters = 5)
labels = classifier.fit_predict(mod_img)
count = Counter(labels)
center_color = classifier.cluster_centers_
count.keys()
ordered_colors = [center_color[i] for i in count.keys()]


def RGB2HEX(color):
      return "#{:02x}{:02x}{:02x}".format(int(color[0]), int(color[1]), int(color[2]))
hex_colors = [RGB2HEX(ordered_colors[i]) for i in count.keys()]
rgb_colors = [ordered_colors[i] for i in count.keys()]

if (1):
      plt.figure(figsize = (8, 6))
      plt.pie(count.values(), labels = hex_colors, colors = hex_colors)
maxi = 0
rgb_colors[1][1]
for i in range(5):
  if rgb_colors[i][1]>rgb_colors[i][0] and rgb_colors[i][1]>rgb_colors[i][2]:
    s = abs(rgb_colors[i][1]-rgb_colors[i][0])+abs(rgb_colors[i][1]-rgb_colors[i][2])
    if s>maxi:
      maxi = s
      c=i
ctr=0

for i in count.keys():
  if c==ctr:
    break
  ctr+=1
idx =i

su = 0  #sumation variable 
for i in count:
  su = su + count[i]       #counting the sum of pixels

per = (count[idx]/su) * 100