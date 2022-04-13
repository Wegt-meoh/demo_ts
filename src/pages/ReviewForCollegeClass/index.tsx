import React from 'react'

import { Code, DocsifyContainer, H1, H2, H3 } from '../../components/DocsifyComponents'


import './index.css'

export default function ReviewForCollegeClass() {


  function main(): JSX.Element {
    return (
      <>
        {/* <H1 title='h1'>
          <H2 title='a标签'>
            <H3 title='a标签'>
              <p>adsfadsfdsa</p>
            </H3>
          </H2>
        </H1> */}
        {/* <H1 title='typescript'>
          <H2 title='type'>
            <p>
              adfkajfljasdkf
            </p>
          </H2>
        </H1>
        <H1 title='h1标签'/>
        <H2 title='html'>
          <p>asfasfds</p>
        </H2> */}
      </>
      // <>
      //   <DocsfyHeaderLink title='html' size='h1' register={registerLinkState} state={state}>
      //     <DocsfyHeaderLink title='a标签' size='h2' register={registerLinkState} state={state} >
      //       <DocsfyHeaderLink title='a标签' size='h3' register={registerLinkState} state={state}>
      //         <p>sdkjf</p>
      //       </DocsfyHeaderLink>
      //     </DocsfyHeaderLink>
      //   </DocsfyHeaderLink>
      //   <DocsfyHeaderLink title='typescript' size='h1' register={registerLinkState} state={state}>
      //     <DocsfyHeaderLink title='type' size='h2' register={registerLinkState} state={state}>
      //       <p>asjdlkfj</p>
      //     </DocsfyHeaderLink>
      //   </DocsfyHeaderLink>
      //   <DocsfyHeaderLink title='h1标签' size='h1' register={registerLinkState} state={state} />
      //   <DocsfyHeaderLink title='html' size='h2' register={registerLinkState} state={state} />
      //   <p>safdsafadsfasfasdfgfdagfdg</p>
      //   </>
    )
  }


  return (
    <DocsifyContainer>      
      {/* {main()} */}
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
