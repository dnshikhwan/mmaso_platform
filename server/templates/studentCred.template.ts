export const studentCredentialsTemplate = (
    name: string,
    email: string,
    password: string
) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Learning Dashboard Login Details</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 font-sans">
    <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-600 px-6 py-4">
            <h1 class="text-2xl font-bold text-white">Your Dashboard Login Details</h1>
        </div>
        
        <div class="px-6 py-4">
            <p class="text-gray-700 mb-4">Dear ${name},</p>
            
            <p class="text-gray-700 mb-4">Welcome to <span class="font-semibold text-blue-600">MMASO platform</span>! Below are your login credentials to access our platform.</p>
            
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p class="font-semibold mb-2">Login Information:</p>
                <ul class="space-y-2">
                    <li><span class="font-medium">Login URL:</span> <a href="mmaso.com" class="text-blue-600 hover:underline">mmaso</a></li>
                    <li><span class="font-medium">Email:</span> ${email}</li>
                    <li><span class="font-medium">Password:</span> <span class="font-mono bg-gray-100 px-2 py-1 rounded">${password}</span></li>
                </ul>
            </div>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p class="font-semibold text-yellow-700 mb-2">Important Notes:</p>
                <ul class="list-disc list-inside space-y-1 text-yellow-700">
                    <li>If you encounter any issues, contact <a href="#" class="text-blue-600 hover:underline">adminmmaso@gmail.com</a> or visit our <a href="#" class="text-blue-600 hover:underline">Help Desk</a>.</li>
                </ul>
            </div>
            
            <p class="text-gray-700 mb-4">We're excited to support your learning journey! Let us know if you have any questions.</p>
            
            <p class="text-gray-700">Best regards,</p>
            <p class="text-gray-700 font-semibold">MMASO</p>
            <p class="text-gray-600 text-sm">adminmmaso@gmail.com</p>
        </div>
        
        <div class="bg-gray-100 px-6 py-4 text-center text-gray-500 text-sm">
            <p>© 2025 PIAPS. All rights reserved.</p>
            <p class="mt-1">If you didn't request this email, please ignore it.</p>
        </div>
    </div>
</body>
</html>`;
};
