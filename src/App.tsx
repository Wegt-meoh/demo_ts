import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import Index from './pages/Index';
import RgbaToHex from './pages/rgba2hex';
import ReviewForCollegeClass from './pages/ReviewForCollegeClass';
import Know from './pages/know';
import RefDemo from './pages/RefDemo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Index />} />
        <Route path='/app/reviewForCollegeClass' element={<ReviewForCollegeClass />} />
        <Route path='/app/rgba2hex' element={<RgbaToHex />} />
        <Route path='/app/know' element={<Know />} />
        <Route path='/app/ref' element={<RefDemo />} />
        <Route path='*' element={<NoMatchPage />} />
      </Routes>
    </div>
  );
}

interface PaintOptions {
  shape: string,
  xPos?: number,
  yPos?: number
}

function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log('pos?0:pos', shape, xPos, yPos)
}

paintShape({ shape: 'triggle', xPos: 1 })

interface ReadOnlyPerson {
  readonly name: string,
  readonly age: number
}

interface WritablePerson {
  name: string,
  age: number
}

interface Plant {
  grow: string
}

type AAA = Plant & Animal

let aaa: AAA = { grow: 'sd', name: 'df' }

console.log('& |', aaa)

interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

let dog: Dog = {
  breed: 'sdf',
  name: ''
}
let cat: Animal = dog
console.log('dog extend animal', cat)

interface NotOKey {
  [index: string]: Animal,
  [index: number]: Dog
}

let notok: NotOKey = { 1: dog }
console.log('index signatures by string and number', notok)

interface Box {
  name: unknown
}

type ff = ((props: string) => string) | ((props: number) => number)
let f: ff = function (x: number): number {
  return 43
}

let x: Box = { name: '6767' }
if (typeof x.name === 'string') {
  console.log('unknow type1', x.name.toLowerCase())
}
console.log('unknow type2', (x.name as string).toLowerCase())

let wPerson: WritablePerson = { name: 'sdf', age: 23 }
let rPerson: ReadOnlyPerson = wPerson
wPerson = rPerson
wPerson.name = 'sdf'

interface StringArray {
  [index: number]: string
}

function getStringArray(): StringArray {
  return { 1: 'sdf', 2: 'sdfds' }
}

let myArray = getStringArray()
let cc = myArray[1]
console.log('index signatures', cc)

type StringNumberPair = [string, number]

function doSomething(thing: StringNumberPair): void {
  thing[0] = '213'
  const [x, y] = thing
  console.log('string number pair', x, y)
}

doSomething(['sdf', 234])

type Either2Dor3D = [number, number, number?]
function print2Dor3D(x: Either2Dor3D) {
  console.log('tuple with question mark change the length', x.length)
}
print2Dor3D([1, 1])
print2Dor3D([1, 1, 1])

function a1() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('1')
    }, 1000)
  })
}

function a2() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject('2')
    }, 2000)
  })
}

function a3() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('3')
    }, 3000)
  })
}

// const t = Promise.all([a1(), a2(), a3()]).then(result => {
//   console.log('promise all result', result)
// }).catch(reason => {
//   console.log('promise all error', reason)
// })

type StringNumberBoolean = [string, number, ...boolean[]]

const stringnn: StringNumberBoolean = ['sdf', 234, true, false, true, false]
console.log('tuple have rest elements', stringnn)

// function useCC<T extends (...args:any[])=>any>(callback:T){
//   callback()
// }

function NoMatchPage() {
  return (
    <div>
      <h2>No such Page, please check your url.</h2>
      <Link to='/'>back to home page</Link>
    </div>
  )
}

export default App;