import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Shower from './pages/Shower';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Link to='/login'>login</Link>} />
        <Route path='/login' element={<Login />} />
        <Route path='/shower' element={<Shower />} />
        <Route path='*' element={<NoMatchPage />}/>
      </Routes>


    </div>
  );
}

interface PaintOptions{
  shape:string,
  xPos?:number,
  yPos?:number
}

function paintShape({shape,xPos=0,yPos=0}:PaintOptions){
  console.log(shape,xPos,yPos)
}

interface ReadOnlyPerson{
  readonly name:string,
  readonly age:number
}

interface WritablePerson{
  name:string,
  age:number
}

interface Animal{
  name:string
}

interface Dog extends Animal{
  breed:string
}

let dog:Dog={
  breed: 'sdf',
  name: ''
}
let cat:Animal=dog

interface NotOKey{
  [index:string]:Animal,
  [index:number]:Dog
}

interface Box{
  name:unknown
}

let x:Box={name:'6767'}
if(typeof x.name === 'string'){
  console.log(x.name.toLowerCase())
}
console.log((x.name as string).toLowerCase())

let wPerson:WritablePerson={name:'sdf',age:23}
let rPerson:ReadOnlyPerson=wPerson
wPerson=rPerson
wPerson.name='sdf'

interface StringArray{
  [index:number]:string
}

function getStringArray():StringArray{
  return {1:'sdf',2:'sdfds'}
}

let myArray=getStringArray()
let cc=myArray[1]
console.log(cc)


function NoMatchPage(){
  return  (
    <div>
      <h2>No such Page, please check your url.</h2>
    </div>
  )
}

export default App;