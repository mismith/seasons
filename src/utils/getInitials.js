export default str => (str || '').replace(/(^| )([a-z])[a-z-]+/ig, '$2');