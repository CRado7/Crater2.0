import React, { useState } from 'react';
import '../styles/ContactPage.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here, such as sending the data to a server
        console.log('Form data submitted:', formData);
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="message">
                    <h2>Tell us what you have to say!</h2>
                    <p>
                        We love hearing from you. 
                        <br /><br />
                        If you are or want to become a distributor or are already one and need more goods, hit the link below to get in touch with our sales team (cant miss it).
                        <br /><br />
                        Are you a rider looking to get sponsored? Submit your video through the link below so we can see what you got.
                        <br />
                        Looking to have your rad art plastered all over our boards next season? Submit that sh*t here too.
                        <br />
                        Just want to leave a comment? Use form because we love to hear you raging about out boards.
                    </p>
                    <button>The Distributor Link</button>         
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject:</label>
                        <input 
                            type="text" 
                            id="subject" 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
}