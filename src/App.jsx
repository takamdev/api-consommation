
import { getAll,uploadDta } from './apiService/apiService.js';
import { storage } from './firebase/config.js';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import ListPasseport from './components/ListPasseport.jsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
// definition du schema de validation du formulaire
const schema = yup
  .object({
    Nom: yup.string().required("ce champ est requis"),    
    Pays: yup.string().required("ce champ est requis"),
    numCart:yup.string().required("ce champ est requis"),
    dateDel:yup.date().required("ce champ est requis"),
    dateExp:yup.date().required("ce champ est requis"),
    image:yup.mixed().required('Une image est requis')
  })


function App() {

  const [list,setList]=useState([])
  const [uploadData,setUploadData]=useState(false)
  const [load,setLoad]=useState(false)


  // recuperation des donnes dans la bd de firebase
  const fetchData = async () => {
    try {
      // Référence à la collection "passager"
      getAll().then(res=>{
          
        setList(res.data.data.reverse())//reverce() permet de classer les passeports pas ordre d'enregistre
        setLoad(false)

      }).catch(err=>{

        console.error("Erreur lors de la récupération des utilisateurs:", err);

      })
      
     
    } catch (error) {

      console.error("Erreur lors de la récupération des utilisateurs:", error);

    }
  };

  useEffect(()=>{
    setLoad(true)//etat de chargement

    fetchData();
  },[])


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })


const formatDate = (date)=>{
  return `
              ${date.getDate()}
              /
              ${(parseInt(date.getMonth())+1)<10?("0"+(parseInt(date.getMonth())+1)):(parseInt(date.getMonth())+1)}
              /${date.getFullYear()}
              `
}


//sauvegard
  const saveData = async (data,url,fileName)=>{

    // construction des données
    const passeport = {
      name:data.Nom,
      contry:data.Pays,
      cartId:data.numCart,
      // formatage de date
      dateDel:formatDate(data.dateDel),
      dateExp:formatDate(data.dateExp),
     img:url,
     fileName:fileName

    }


    //envoie des données
    uploadDta(passeport).then(()=>{

      fetchData();

      toast.success("enregistrer avec success",{className:"text-success",style:{transform:"scale(2)"}})
    }).catch(err=>{
      console.log(err);
    })
   }
  
   // filtrage de la liste apret la suppression d'un document
  const filterList = (id)=>{

   const newList = list.filter(item=>item._id!==id)
   setList(newList)


  }

  //enregistrement d'un passeport
  const onSubmit = async (data) => {

    const file = data.image[0]//fichier image
    console.log(file);
    
    const cardidIsExist = list.find(item=>item.cartId===data.numCart)
    const imgIsExist = list.find(item=>item.fileName===file.name)

    if(cardidIsExist===undefined&&imgIsExist===undefined){


      if(!file.type.includes("image")){

        toast.warning('seul les images sont accepter',{className:"text-danger",style:{transform:"scale(2)"}})

      }else{


      if(formatDate(data.dateDel)===formatDate(data.dateExp)){

        toast.warning('les dates sont identique!!!',{className:"text-danger",style:{transform:"scale(2)"}})

       }else{

        setUploadData(true)//etat de chargemnt
     
      // reference vers le store
      const storageRef = ref(storage, `images/${file.name}`);
  
      
      uploadBytes(storageRef, file).then(async ()=>{ // envoie de l'image

        const urlImage = await getDownloadURL(storageRef)//recuperation de l'url de l'image

        saveData(data,urlImage,file.name)//appel de la fonction de sauvegard

        setUploadData(false)//etat de chargement

      }).catch(err=>{

        console.log(err);

      })
       }
      }
     
    
    }else{

      toast.warning('ce passeport est deja enregistrer',{className:"text-danger" ,style:{transform:"scale(2)"}})

    }
   

  }


  
  return (
    <main className='container-fluid mt-5 pt-5'>
      <div style={{backgroundColor:"#e7be43",height:'100px' ,textAlign:"center"}}>
         <p className='fs-3 fw-bold' style={{paddingTop:"25px"}}>Enregistrement de passeport</p>
      </div>
      <section className='row'>
     
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className='mt-5 col-lg-4 col-md-12 col-sm-12'>
        <div className="form-floating mb-3">
          <input {...register("Nom")} type="text" className="form-control h-25" id="floatingInput" placeholder="Nom"/>
          <label htmlFor="floatingInput">Nom</label>
        </div>
        <p className='text-danger'>{errors.Nom?.message}</p>
        <div className="form-floating mb-3">
          <input {...register("Pays")} type="text" className="form-control h-25" id="floatingInput" placeholder='Pays'/>
          <label htmlFor="floatingInput">Pays</label>
        </div>
        <p className='text-danger'>{errors.Pays?.message}</p>
        <div className="form-floating mb-3">
          <input {...register("numCart")}  type="text" className="form-control h-25" id="floatingInput" placeholder='number'/>
          <label htmlFor="floatingInput">numéro de passeport</label>
        </div>
        <p className='text-danger'>{errors.numCart?.message}</p>
        <div className="form-floating mb-3">
          <input {...register("dateDel")} type="date" className="form-control h-25" id="floatingInput" placeholder='date del'/>
          <label htmlFor="floatingInput">date de delivrance</label>
        </div>
        <p className='text-danger'>{errors.dateDel?'ce champ est requis':""}</p>
        <div className="form-floating mb-3">
          <input {...register("dateExp")} type="date" className="form-control h-25" id="floatingInput" placeholder='date exp' />
          <label htmlFor="floatingInput">date d&apos;expiration</label>
        </div>
        <p className='text-danger'>{errors.dateExp?'ce champ est requis':""}</p>
        <div className="form-floating mb-3">
          <input {...register("image")} type="file" accept='image/*' className="form-control h-25" id="floatingInput" placeholder='image' />
          <label htmlFor="floatingInput">image</label>
        </div>
        <p className='text-danger'>{errors.image?.message}</p>
        <button type="submit" disabled={uploadData} className='btn btn-primary'>{uploadData?"enrégistrer...":"enrégistrer"} </button>
      </form>
      <article className='mt-lg-5  mt-sm-3 mt-md-3 col-lg-8 col-md-12 col-sm-12'>
        {
        load?(
          <p className='text-secondary text-center fs-3'>patientez...</p>
        ):(
           <ListPasseport data={list} filterList={filterList}/>
        )
       }
        
       
      </article>
      </section>
    </main>
  )
}

export default App