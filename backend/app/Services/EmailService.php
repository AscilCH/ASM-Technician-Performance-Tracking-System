<?php
// app/Services/EmailService.php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;

class EmailService
{
    public function sendMail($to, $subject, $body)
    {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = env('MAIL_HOST');
            $mail->SMTPAuth = env('MAIL_USERNAME') ? true : false; // Set to true if your SMTP server requires authentication
            if ($mail->SMTPAuth) {
                $mail->Username = env('MAIL_USERNAME');
                $mail->Password = env('MAIL_PASSWORD');
            }
            $mail->SMTPSecure = env('MAIL_ENCRYPTION');
            $mail->Port = env('MAIL_PORT');

            // Recipients
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true); // Set to true for HTML email
            $mail->Subject = $subject;
            $mail->Body = $body;

            $mail->send();
            Log::info('Email sent successfully to: ' . $to);
        } catch (Exception $e) {
            Log::error("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            throw new \Exception("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        }
    }

    public function sendEmailToHighestScoringTech()
    {
        $technicien = Technicien::orderBy('score', 'desc')->first();

        if ($technicien) {
            $this->sendMail(
                $technicien->email,
                'Congratulations!',
                'You have the highest score for the month!'
            );
            return response()->json(['message' => 'Email sent successfully to: ' . $technicien->email]);
        } else {
            return response()->json(['message' => 'No technician found.'], 404);
        }
    }
}
