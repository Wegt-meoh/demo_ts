import React, { useState } from 'react'
import { InputNumber, Button, Space } from 'antd';
import './index.css'

export default function RgbaToHex() {

    interface g {
        direction: 'vertical' | 'horizontal'
        R: number
        G: number
        B: number
        A: number
        res: string
    }
    const [state, setState] = useState<g>({ direction: 'vertical', R: 255, G: 255, B: 255, A: 100, res: '#FFFFFFFF' })

    function changeValue(x: 'R' | 'G' | 'B' | 'A', value: number | null) {
        let newState = { ...state }
        newState[x] = value == null ? 0 : value

        newState['res'] = "#" +
            ("0" + newState.R.toString(16)).slice(-2) +
            ("0" + newState.G.toString(16)).slice(-2) +
            ("0" + newState.B.toString(16)).slice(-2) +
            ("0" + Math.floor(newState.A * 0.01 * 255).toString(16)).slice(-2)

        setState(newState)
    }

    function changeDirection() {
        if (state.direction === 'vertical') {
            setState({...state,direction:'horizontal'})
        } else {
            setState({...state,direction:'vertical'})
        }
    }

    return (
        <Space direction={state.direction} className='rgba2Hex'>
            <Button onClick={changeDirection}>change direction</Button>
            <div>R=<InputNumber min={0} max={255} value={state.R} onChange={(value: number | null) => changeValue('R', value)} /></div>
            <div>G=<InputNumber min={0} max={255} value={state.G} onChange={(value: number | null) => changeValue('G', value)} /></div>
            <div>B=<InputNumber min={0} max={255} value={state.B} onChange={(value: number | null) => changeValue('B', value)} /></div>
            <div>
                A=<InputNumber
                    value={state.A}
                    min={0}
                    max={100}
                    addonAfter='%'
                    style={{ width: '110px' ,marginTop:'5px'}}
                    onChange={(value: number | null) => changeValue('A', value)}
                />
            </div>
            <div className="result">
                result:{state.res}
            </div>
        </Space>
    )
}