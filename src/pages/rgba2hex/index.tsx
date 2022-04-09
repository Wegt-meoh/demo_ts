import React, { useState } from 'react'
import { InputNumber, Button, Space } from 'antd';
import './index.css'

export default function RgbaToHex() {

    const [state, setState] = useState({ R: 255, G: 255, B: 255,A:100, res: '#FFFFFFFF' })

    function changeValue(x: 'R' | 'G' | 'B' |'A', value: number | null) {
        let newState = { ...state }
        newState[x] = value == null ? 0 : value
        
        newState['res'] = "#" +
            ("0" + newState.R.toString(16)).slice(-2) +
            ("0" + newState.G.toString(16)).slice(-2) +
            ("0" + newState.B.toString(16)).slice(-2) +
            ("0" + Math.floor(newState.A*0.01*255).toString(16)).slice(-2)

        setState(newState)
    }

    return (
        <div className="rgba2Hex">
            <div>
                R=<InputNumber min={0} max={255} value={state.R} onChange={(value: number | null) => changeValue('R', value)} />
                G=<InputNumber min={0} max={255} defaultValue={state.G} onChange={(value: number | null) => changeValue('G', value)} />
                B=<InputNumber min={0} max={255} defaultValue={state.B} onChange={(value: number | null) => changeValue('B', value)} />
                A=<InputNumber
                    defaultValue={state.A}
                    min={0}
                    max={100}
                    style={{width:'110px'}}
                    addonAfter='%'
                    onChange={(value: number | null) => changeValue('A', value)}
                />
            </div>
            <div className="result">
                result:{state.res}
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
