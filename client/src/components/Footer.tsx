const Footer = () => {


    const content = (
    <>
        <div className="mt-8 py-16 px-36 bg-primary grid grid-cols-3 gap-10">
            <div className="flex justify-center flex-col items-center">
                <div className="text-left">
                    <h1 className="text-3xl pb-2 text-white font-semibold">G<span className="text-accent">oll</span>um</h1>        
                    <p className="text-white font-semibold">2004-2024 CKDBarnes Ltd</p>
                    <ul className="flex flex-row items-start text-white gap-x-5 justify-items-start">
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Github</a></li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center flex-col items-center">
                <div className="text-left">
                    <h1 className="text-3xl pb-2 text-white font-semibold">Info</h1>        
                    <ul className="flex flex-col items-start text-white justify-center">
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Development Status</a></li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center flex-col items-center">
                <div className="text-left">
                    <h1 className="text-3xl pb-2 text-white font-semibold">Contact Us</h1>        
                    <ul className="flex flex-col items-start text-white justify-center">
                        <li><a href="#">Support / Feedback</a></li>
                        <li><a href="#">Something</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </>
    )

    return content
}

export default Footer