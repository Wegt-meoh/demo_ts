import React, { useState } from 'react'
import { InputNumber, Button, Space } from 'antd';
import './index.css'

export default function RgbToHex() {

    const [state, setState] = useState({ R: 255, G: 255, B: 255, A: 100 ,res:'#FFFFFF'})

    function myMain(e: any) {
        let value: string = e.target.value
        // setState({ ...state, res: hexify(value) })
    }

    return (
        <div className="rgba2Hex">
            <div>
                R=<InputNumber min={0} max={255} value={state.R} />
                G=<InputNumber min={0} max={255} defaultValue={state.G} />
                B=<InputNumber min={0} max={255} defaultValue={state.B} />
                A=<InputNumber
                    defaultValue={state.A}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                />
            </div>
            <div>
                result:<span className="result">{state.res}</span>
            </div>
        </div>
    )
}


function hexify(color: string) {
    var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
    var a = parseFloat(values[3] || '1'),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
}

var myHex = hexify('rgba(13, 101, 80, 0.495)'); // "#f5faf3"

console.log(myHex);
