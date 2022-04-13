import React from 'react'

import { Code, DocsifyContainer, H1, H2, H3 } from '../../components/DocsifyComponents'


import './index.css'

export default function ReviewForCollegeClass() {

  return (
    <DocsifyContainer>            
      <>
        <H1 title='h1'>
          <H2 title='a标签'>
            <H3 title='a标签'>
              <Code>adsfadsfdsa</Code>
            </H3>
          </H2>
        </H1>
        <H1 title='h1标签' />
        <H2 title='html'>
          <Code>asfasfds</Code>
        </H2>
      </>
    </DocsifyContainer >
  )
}
