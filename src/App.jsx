import React from 'react';
import { firebase } from './firebase';

function App() {

  const [tarea, setTarea] = React.useState('')
  const [tareas, setTareas] = React.useState([])
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')
  const [error, setError] = React.useState(null)

  React.useEffect(()=>{
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
    obtenerDatos()

  }, [])

  const agregarTarea = e => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('Digite tarea')
      setError('Digite la Tarea')
      return
    }

    setTareas([
      ...tareas,
      {id: 1, nombreTarea:tarea}
    ])

    setTarea('')
    setError(null)
  }

  const eliminarTarea = id => {
    const arrayFiltrado = tareas.filter(item => item.id !== id)
    setTareas(arrayFiltrado)
  }

  const editar = item => {
    console.log(item)
    setModoEdicion(true)
    setTarea(item.nombreTarea)
    setId(item.id)
  }

  const editarTarea = e => {
    e.preventDefault()
    if(!tarea.trim()){
      console.log('Elemento Vacío')
      setError('Escriba algo por favor...')
      return
    }

    const cancelar = () =>{
      setModoEdicion(false)
      setTarea('')
      setId('')
      setError(null)
    }


    const arrayEditado = tareas.map(
      item => item.id === id ? {id:id, nombreTarea:tarea} : item
      )
    
      setTareas(arrayEditado)
      setTarea('')
      setId('')
      setError(null)
      setModoEdicion(false)
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
      </div>
    </div>
  );
}

export default App;
