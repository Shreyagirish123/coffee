import React,{useState,useEffect} from 'react';

export default function App(){
 const [products,setProducts]=useState([]);
 const [form,setForm]=useState({name:'',price:'',image_url:''});

 async function load(){
  const r=await fetch('http://localhost:4000/api/products');
  setProducts(await r.json());
 }

 useEffect(()=>{ load(); },[]);

 async function addProduct(){
  await fetch('http://localhost:4000/api/products',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(form)
  });
  setForm({name:'',price:'',image_url:''});
  load();
 }

 async function del(id){
  await fetch('http://localhost:4000/api/products/'+id,{method:'DELETE'});
  load();
 }

 return(
  <div style={{padding:20}}>
   <h1>Coffee Shop Products</h1>
   <input placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
   <input placeholder='Price' value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
   <input placeholder='Image URL' value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})}/>
   <button onClick={addProduct}>Add</button>

   <ul>
    {products.map(p=>(
     <li key={p.id}>
      {p.name} - ₹{p.price}
      <button onClick={()=>del(p.id)}>Delete</button>
     </li>
    ))}
   </ul>
  </div>
 );
}
