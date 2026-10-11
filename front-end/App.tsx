import { StatusBar } from 'expo-status-bar';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import "./global.css";
import { ImagePickerAsset, launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { useEffect, useState } from 'react';
export default function App() {

  const [asset, setAsset] = useState<ImagePickerAsset>();
  const [image, setImage] = useState<string>();

  // pickimage before manage permission

  const pickImage = async () => {
    const permission = await requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      console.info("Permission denited..");

    } else {

      const media = await launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: "images",
        quality: 1,
        aspect: [4, 3],
      });


      if (media.canceled) {
        console.info("Image cancel...");

      } else {

        const imageAsset = media.assets[0];
        setAsset(imageAsset);

      }


    }

  }


  //load image

  // image upload user id
 
  const loadImage = async () => {

    const response = await fetch(`http://${process.env.EXPO_PUBLIC_HOST}:3000/api/v1/imageView?id=123456`);

    if (response.ok) {


      const result = await response.json();


      setImage(result.imageUrl);


    }

  }

  useEffect(() => {

    loadImage();

  }, []);


  return (
    <View className='flex-1 justify-center items-center'>


      <View className='w-[300] h-[350] bg-gray-900 rounded-2xl justify-center items-center'>

 

        <View >
          <Image source={asset?.uri ? { uri: asset.uri }:image?{uri:image}:{}} className='w-[200] h-[200] rounded-md rounded-br-4xl border border-amber-300' />
          <TouchableOpacity onPress={() => pickImage()} className='w-[55] h-[55] bg-yellow-600 rounded-full absolute bottom-0 right-0 justify-center items-center'><Image className='w-[28] h-[28]' source={require('./assets/edit.png')} /></TouchableOpacity>

        </View>

        <View className='w-full absolute bottom-0 p-5'>

          {/*  data send backend */}

          <TouchableOpacity onPress={async () => {

            const form = new FormData();  // create form object multiple data store

            form.append("image", {

              uri: asset?.uri, // image path
              type: asset?.mimeType, // image type
              name: `12345.${asset?.fileName?.split('.')[1]}`, //image name --> default name file-->userid

              // 12345. join  -->defultname:  abdhff.png -->split -->abdhff |.| png --->12345.png
              //[0]      [1]

            } as any); // ignore type trust 



            // create fetch api

            // create server end point

            //host-->ip address can get -->open cmd--> type-->ipconfig 

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_HOST}:3000/api/v1/upload`, {
              method: "POST",
              body: form,
            });

            if (response.ok) {

              const result = await response.json();

              console.log(result.message);

            }


          }} className='w-full h-[45] rounded-md bg-blue-600 justify-center items-center flex-row gap-2'>
            <Image className='w-[28] h-[28]' source={require('./assets/upload.png')} />
            <Text className='text-lg text-slate-50 font-semibold'>Upload Image</Text>
          </TouchableOpacity>

        </View>



      </View>

      <StatusBar style="auto" />
    </View>
  );
}
