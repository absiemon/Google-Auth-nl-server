// function to generate response format
const genResponseFromat = (id, name, email, created_at, token) => {
    const obj = {
        status: true,
        content: {
            data: {
                id, name, email, 
                picture: "https://gravatar.com/avatar/5c9e856d9dfff899009faf44b9bee015?s=400&d=robohash&r=x",
                created_at
            }
        },
        meta: {
            access_token: token
        }
    }
    return obj;
}

export default genResponseFromat;