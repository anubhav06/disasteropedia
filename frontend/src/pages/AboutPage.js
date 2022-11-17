import './AboutPage.css';

const AboutPage = () => {
    return (
        <div>
            <h1> About - disasteropedia </h1>
            <div>
                <p className="question"> Q. What is disasteropedia ? 🤔💭 </p>
                <div className="answer">
                    This is a website for monitoring the disaster situation in India through Social Media posts. <br />
                    It is mainly made for the government agencies in India, like NDRF (National Disaster Relief Force) <br/>
                    <br /> Please Note: This is not an official website of/for the government. This is created by me, Anubhav, for social good, <br />
                    and can even by used by residents of India, to get updates about the disaster situation near them.
                </div>

                <p className="question"> Q. How does it work ? 🖥️ </p>
                <div className="answer">
                    Any post which is shared on Social Media (currently supports Twitter only), which is about a disaster, <br />
                    gets shown here on the website, along with the media of that disaster, in real time (LIVE). <br />
                    It finds the important data from the tweets, like the location and type of disaster. <br/>
                    All this data is shown in a user friendly & organized manner, to make it easier for the authorities to monitor the situation.
                    
                </div>

                <p className="question"> Q. Who am I ? 👨🏽‍🦱</p>
                <div className="answer">
                    I'm <a href="https://www.linkedin.com/in/anubhav-gupta06/" target='_blank' rel='noreferrer' style={{ color: '#d3354c' }}>
                        Anubhav Gupta
                    </a>, an undergraduate, passionate about Software Development. <br />
                    I like to develop & build stuff, and this is, yet another creation by me. <br />
                    You can folow me on Twitter
                    <a href="https://twitter.com/anubhavstwt" target='_blank' rel='noreferrer' style={{ color: '#d3354c', marginLeft: '5px' }}>
                    here.
                    </a>
                </div>

                <p className="question"> Q. How can you support this website ? 💪🏽</p>
                <div className="answer">
                    There are a number of ways by which you can support this project and it's existence :
                    <div className='support-subheading'>
                        <a href="https://github.com/sponsors/anubhav06" target='_blank' rel='noreferrer' style={{color: '#d3354c'}}>
                            1. SPONSORING THE PROJECT: 💵
                        </a>
                        <br />Running this app, 24*7, comes at a cost. Sponsoring would enable me to keep this app running. <br />
                        You can sponsor this project by any amount you like. Each ₹ counts. 
                        <a href="https://github.com/sponsors/anubhav06" target='_blank' rel='noreferrer' style={{color: '#3c1874', marginLeft: '5px'}}>
                            More info here.
                        </a>
                    </div>
                    <div className='support-subheading'>  
                        <a href="https://github.com/sponsors/anubhav06" target='_blank' rel='noreferrer' style={{color: '#d3354c'}}>
                            2. STARING ON GITHUB: ⭐
                        </a>
                        <br /> The codebase of this project is open-source, and it is open for anyone to contribute to this project.<br />
                        Give this project a star on GitHub.
                        <a href="https://github.com/sponsors/anubhav06" target='_blank' rel='noreferrer' style={{color: '#3c1874', marginLeft: '5px'}}>
                            More info here.
                        </a>
                    </div>
                    <div className='support-subheading'>
                        <a href="https://twitter.com/home" target='_blank' rel='noreferrer' style={{color: '#d3354c'}}>
                        3. SHARING WITH OTHERS: 🌐
                        </a>
                        <br />Spread the knowledge and information about this project. <br />
                        That's the least you can do to support the project.
                    </div>
                    <br/><br/><br/>
                </div>
            </div>
        </div>
    )
}

export default AboutPage