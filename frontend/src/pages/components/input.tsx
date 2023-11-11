interface props {
    id?: string
    placeholder?: string
    value?: string
}
export default function Input(p: props) {
    return (
        <div className="">
            <input id={p.id} value={p.value} placeholder={p.placeholder} type="text"
                   className=" block w-full rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"/>
        </div>
    )
}