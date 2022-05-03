# personal pratice for TypeScript and React

## before use
cd this project
```typescript
//check you have yarn
yarn -v
//if you do not have yarn please intall it first
//following cmd use a registry https://registry.npmmirror.com remove it if unneccessary
npm install -g yarn --registry=https://registry.npmmirror.com

//install independencies
yarn

//run
yarn start

//build
yarn build
```
## developing issue
* issue:how to transform `Header`(for user) => `DocsfiyHeaderLink`(true component) in `DocsifyContainor`
* solve:use `DocsifyContainor.children`
* issue:repeative `title` property in `Header`
* solve:add suffix like 'h1-1','h1-2'...
* issue:how to let side bar hidden moothly
* solve:use css properties transform and transition
* issue:generate side bar content
* solve:by `DocsifyContainor.children`
* issue:scroll listener has conflict with hash value
* solve:useRef to judge if need handle scroll
* 