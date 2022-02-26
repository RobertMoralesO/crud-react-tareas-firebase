import { specialCharMap } from '@testing-library/user-event/dist/keyboard';
import React from 'react';
import { firebase } from './firebase';

function App() {

  const [tarea, setTarea] = React.useState('')
  const [tareas, setTareas] = React.useState([])
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')
  const [error, setError] = React.useState(null)

  const obtenerDatos = async () => {
    try{
      const db = firebase.firestore()
      const data = await db.collection('tareas').get()
      const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setTareas(arrayData)

    }catch(error){
      console.log(error)
    }
  }

  React.useEffect(()=>{
    
    obtenerDatos()

  }, [])

  const agregarTarea = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      setError('Digite la Tarea')
      return
    }

    try{
       const db = firebase.firestore()
       const nuevaTarea = {
         nombreTarea: tarea
       }

       const data = await db.collection('tareas').add(nuevaTarea)

       setTareas([
        ...tareas,
        {id: data.id, ... nuevaTarea}
      ])
  
        setTarea('')
        setError(null)

    }catch(error){
      console.log(error)
    }


  }

  const eliminarTarea = async(id) => {
    try{
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).delete()
      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    }catch(error){
      console.log(error)
    }

  }

  const editar = item => {
    setError(null)
    console.log(item)
    setModoEdicion(true)
    setTarea(item.nombreTarea)
    setId(item.id)
  }

  const editarTarea = async(e) => {
    e.preventDefault()
    if(!tarea.trim()){
      setError('Digite la tarea')
      return
    }

    try{
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).update({
        nombreTarea: tarea
      })
      //obtenerDatos()

      const arrayEditado = tareas.map(
        item => item.id === id ? {id:id, nombreTarea:tarea} : item
      )
      
      setTareas(arrayEditado)
      setTarea('')
      setId('')
      setError(null)
      setModoEdicion(false)

    }catch(error){
      console.log(error)
    }
  }
  const cancelar = () =>{
    setModoEdicion(false)
    setTarea('')
    setId('')
    setError(null)
  }
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <h3>Listado de tareas</h3>
          <ul className="list-group">
            {
              tareas.map(item => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">{item.nombreTarea}</span>
                
                    <button 
                      className='btn btn-danger btn-sm float-end mx-2'
                      onClick={() => eliminarTarea(item.id)}>Eliminar</button>
                    <button 
                    className='btn btn-warning btn-sm float-end'
                    onClick ={() => editar(item)}>Editar</button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-4">
          <h4 className="text-center">
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
            }
          </h4>
          <form onSubmit={modoEdicion ? editarTarea : agregarTarea}>
            {
              error ? <span className="text-danger">{error}</span> : null
            }
            <input
              type="text"
              className='form-control mb-2'
              placeholder='Ingresse Tarea'
              onChange={e => setTarea(e.target.value)}
              value = {tarea}
            />
            {
              modoEdicion ?
              (<>
              <button className="btn btn-warning btn-block"
              type='submit'> Editar </button>
              <button className="btn btn-dark btn-block mx-2"
              type='submit'
              onChange={()=> cancelar()}> Cancelar </button>
              </>)
              :
              (
                <button className="btn btn-dark btn-block"
                type='submit'> Agregar </button>
              )
            }
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
