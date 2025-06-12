const CoverLetter = async({params}) => { // As id is a dynamic route which changes according to the id of the cover letter
    // we can access id in inside of its page.jsx by using params and params.id
    const id = await params.id
  return  <div>CoverLetter : {id}</div>
  
}

export default CoverLetter