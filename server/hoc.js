// Higher-Order Component (HOC) - Function
// const t = 'hello'
const function_1 = (param) => {
    console.log('1' + param)
}
const function_2 = (param2) => {
    console.log('2' + param2)
}
const function_hoc = (callback) => (x) => {
 const t = 'abc'
    callback(x + t)
}
// function_1('abc')
// function_2('xyz')
// function_hoc (function_1) ('function 1')
// function_hoc (function_2) ('function 2')
// A: function () => A('')

const Component = (props) => {
    return console.log('JXT' + props)
}

const hoc = (Component) => (param) => {
    const t = 'abc'
    return Component()
}