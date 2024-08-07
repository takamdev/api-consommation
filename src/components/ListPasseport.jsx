import { TiDelete } from "react-icons/ti"; 
import { AiTwotoneEdit } from "react-icons/ai"; 
import { useEffect } from "react";
import { useState } from "react"
import { getDownloadURL, ref, uploadBytes,deleteObject } from "firebase/storage";
import { storage } from "../firebase/config.js";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { editData,deleteData } from "../apiService/apiService.js";
import TableComponent from "./Table.jsx";
const schema = yup
  .object({
    Nom: yup.string().required("ce champ est requis"),    
    Pays: yup.string().required("ce champ est requis"),
    numCart:yup.string().required("ce champ est requis"),
    dateDel:yup.date().required("ce champ est requis"),
    dateExp:yup.date().required("ce champ est requis"),
    image:yup.mixed().required('Une image est requis')
  })
  .required()

function ListPasseport({data,filterList}) {

 const filtre = data
 const [passport ,setPasseport]=useState(data)
 const [filter,setFilter] = useState([])
 const [defaultData,setDefaultData]=useState()
 const [loadUpdate,setLoadUpdate]= useState(false)
 const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
})

// modification des donnees d'un passeport
const onSubmit = (edit) =>{
  setLoadUpdate(true)//etat de chargement
  //reference vers l'encien fichier
  const storageRef = ref(storage, `images/${defaultData.fileName}`);

 // Nouveau fichier à télécharger
 const newFile = edit.image[0]

  uploadBytes(storageRef, newFile).then( async (snapshot) => {
    console.log('Nouveau fichier téléchargé avec succès', snapshot);
    const urlImage = await getDownloadURL(storageRef)//recuperation de l'url de l'image
//modification des donnees
    // Les nouvelles données
    const newData = {
      name:edit.Nom,
      contry:edit.Pays,
      cartId:edit.numCart,
      // formatage de date
      dateDel:`
              ${edit.dateDel.getDate()}
              /
              ${(parseInt(edit.dateDel.getMonth())+1)<10?("0"+(parseInt(edit.dateDel.getMonth())+1)):(parseInt(edit.dateDel.getMonth())+1)}
              /${edit.dateDel.getFullYear()}
              `,
      dateExp:`
            ${edit.dateExp.getDate()}
            /
            ${(parseInt(edit.dateExp.getMonth())+1)<10?("0"+(parseInt(edit.dateExp.getMonth())+1)):(parseInt(edit.dateExp.getMonth())+1)}
            /${edit.dateExp.getFullYear()}
            `,
     img:urlImage,
     fileName:newFile.name
    }
    //modification
    editData(defaultData.id,newData).then(()=>{
      console.log('Document créé ou remplacé avec succès');
      setLoadUpdate(false)//etat de chargement
      // modification au niveau de la'ffichage dans le dom
      
      //filtrage
      let newPasseport=passport.filter(item=>item.id!==defaultData.id)
      newPasseport = [...newPasseport,newData]
      //modification
      setPasseport(newPasseport)

      //fermeture du modal de modification
      document.querySelector('#modalClose').click()
    })
  }).catch((error) => {
    console.error('Erreur lors du téléchargement du fichier:', error);
  });


}
// initialisatiion des donnees
 useEffect(()=>{

    const contryList = filtre.map(item=>item.contry)
    // filtre des dublication avec l'insensibilieté a la cast
    const uniqueArray = [...new Set(contryList.map(item => item.toLowerCase()))];

    setFilter(uniqueArray)
    setPasseport(data)

    
 },[data])


 // filtre pas pays
 const select = (value)=>{

    if(value.trim()!==""){//verification de la valeur champ
      //filtrage

      const result= filtre.filter(item =>item.contry.toLowerCase()===value.toLowerCase())

      //modification de la liste
      setPasseport(result)

    }else{

      //initialisation de la liste si valeur du champ vide
      setPasseport(data)

    }
 }
//recherche pas numero de passeport
 const changeValue =(value)=>{

    const isInclude = filtre.filter(item=>item.cartId.includes(value))

    setPasseport(isInclude)

    if(value.trim()===""){

      setPasseport(data)

    }
 }
 //suppression d'un passeport
 const deletePasseport = (item)=>{
  // recuperer l'id firebase du passeport
  const id = item.id
//demande de confirmation

  const confirm = window.confirm('voulez vous vraiment supprimer se passeport ?')

  if(confirm){
    // Suppression du document

    deleteData(id).then(()=>{

      const result= passport.filter(item=>item.id!==id)

      setPasseport(result)

      filterList(id)
      //suppression de l'image

      const fileRef = ref(storage, `images/${item.fileName}`);//reference de l'image

      deleteObject(fileRef).then(() => {

        console.log('Fichier supprimé avec succès');

      }).catch((error) => {

        console.error('Erreur lors de la suppression du fichier:', error);

      });
    }).catch(err=>{

        console.log(err);

    })
   
   }
 
 }
  return (
    <div className="w-100 pt-0 mt-0 ">
      
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Modifier le passeport</h1>
                <button type="button" className="btn-close" id="modalClose" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
                  <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                            <div className="form-floating mb-3">
                            <input defaultValue={defaultData&&defaultData.name}  {...register("Nom")} type="text" className="form-control h-25" id="floatingInput" placeholder="Nom"/>
                            <label htmlFor="floatingInput">Nom</label>
                            </div>
                            <p className='text-danger'>{errors.Nom?.message}</p>
                            <div className="form-floating mb-3">
                            <input defaultValue={defaultData&&defaultData.contry} {...register("Pays")} type="text" className="form-control h-25" id="floatingInput" placeholder='Pays'/>
                            <label htmlFor="floatingInput">Pays</label>
                            </div>
                            <p className='text-danger'>{errors.Pays?.message}</p>
                            <div className="form-floating mb-3">
                            <input defaultValue={defaultData&&defaultData.cartId} {...register("numCart")}  type="text" className="form-control h-25" id="floatingInput" placeholder='number'/>
                            <label htmlFor="floatingInput">numéro de carte</label>
                            </div>
                            <p className='text-danger'>{errors.numCart?.message}</p>
                            <div className="form-floating mb-3">
                            <input  {...register("dateDel")} type="date" className="form-control h-25" id="floatingInput" placeholder='date del'/>
                            <label htmlFor="floatingInput">date de delivrance</label>
                            </div>
                            <p className='text-danger'>{errors.dateDel?'ce champ est requis':""}</p>
                            <div className="form-floating mb-3">
                            <input  {...register("dateExp")} type="date" className="form-control h-25" id="floatingInput" placeholder='date exp' />
                            <label htmlFor="floatingInput">date d&apos;expiration</label>
                            </div>
                            <p className='text-danger'>{errors.dateExp?'ce champ est requis':""}</p>
                            <div className="form-floating mb-3">
                            <input  {...register("image")} type="file" accept='image/*' className="form-control h-25" id="floatingInput" placeholder='image' />
                            <label htmlFor="floatingInput">image</label>
                            </div>
                            <p className='text-danger'>{errors.image?.message}</p>
                            <button disabled={loadUpdate} type="submit" className='btn btn-primary'>{loadUpdate?"Modification...":"Modifier"}</button>
                        </form>
                     </div>
                            
                        
            </div>
          </div>
        </div>
        <div className="row filter">
            <p className="col-lg-3 col-md-4 col-sm-5  search">
             <input className="form-control  " style={{height:"50px"}} onChange={(e)=>{changeValue(e.target.value)}}  type="text"  id="floatingInput" placeholder="identifiant"/>
             </p>
            <p className=" select col-lg-3 col-md-4 col-sm-5 ms-auto">
              <select className="form-select" style={{height:"50px"}} onChange={(e)=>{select(e.target.value)}}  aria-label="Default select example">
                  <option value="" selected>tous les pays</option>
                  {
                      filter.map((item,key)=>{
                          return <option key={key}  value={item}>{item}</option>
                      })
                  }
              </select>
            </p>
        </div>
          {
            passport.length ===0 ? (
              <p className="text-center fs-4">aucun passeport trouver</p>
            ):(
              <div>
                <TableComponent setDefaultData={setDefaultData} deletePasseport={deletePasseport} key={5} Passport={passport}/>
              </div>
               
            )
          }
        
    </div>
  )
}

export default ListPasseport