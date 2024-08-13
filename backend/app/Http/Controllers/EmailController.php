<?php

// app/Http/Controllers/EmailController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\EmailService;

class EmailController extends Controller
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    public function sendEmail(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        $to = $request->input('to');
        $subject = $request->input('subject');
        $body = $request->input('body');

        // Send email
        $this->emailService->sendMail($to, $subject, $body);

        return response()->json(['message' => 'Email sent successfully']);
    }
}
