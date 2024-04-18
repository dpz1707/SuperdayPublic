export default function Privacy() {
    return (<div className="w-[500px]">
        <h1 className="text-3xl text-black">Privacy Policy</h1>
        <br></br>
        <p>
            At Superday, we prioritize your privacy and are committed to protecting your personal information. Our Privacy Policy outlines how we collect, use, store, and protect your data. We collect information directly from you, including your email address, name, and public profile details, along with an authentication code to send emails on your behalf for recruiting purposes to niche firms. This information is securely stored in our DynamoDB database. Superday uses Google OAuth scopes, including userinfo.email, userinfo.profile, and gmail.send, to enhance your experience and automate email sending. We ensure your data is securely stored and never shared with third parties. Your data, including any resumes and introductions you choose to attach to emails, is retained from the time of subscription and can be deleted upon request by contacting our support team. We are dedicated to maintaining the confidentiality and integrity of your information, adhering to industry-standard data protection practices. Superday complies with the Google API Services User Data Policy including the Limited Use requirements. Any users of Superday are subject to our terms of service, privacy policy, and <a href="https://developers.google.com/terms/api-services-user-data-policy"><u>Google API Services User Data Policy</u></a>.
        </p>
    </div>)
}