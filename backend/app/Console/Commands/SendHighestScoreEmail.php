<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmailService;
use App\Models\Technicien;

class SendHighestScoreEmail extends Command
{
    protected $signature = 'email:send-highest-score';
    protected $description = 'Send an email to the technician with the highest score';

    private $emailService;

    public function __construct(EmailService $emailService)
    {
        parent::__construct();
        $this->emailService = $emailService;
    }

    public function handle()
    {
        $highestScoringTechnician = Technicien::orderBy('score', 'desc')->first();

        if ($highestScoringTechnician) {
            $email = $highestScoringTechnician->email;

            // HTML email template
            $emailBody = '
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Top Technician of the Month</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .header img {
                        max-width: 150px;
                        }
                        .content {
                            font-size: 16px;
                            color: #333333;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 14px;
                            color: #777777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                    
                        <div class="header">
                            <div >
                            <img src="https://i.imgur.com/6C273Tc.jpeg" alt="ASM Logo">
                            </div>
                            <h1>Congratulations ' . $highestScoringTechnician->first_name .' '.$highestScoringTechnician->last_name.'!</h1>
                        </div>
                        <div class="content">
                            <p>Good morning,</p>
                            <p>We are thrilled to inform you that you are the top technician of the month! Your outstanding performance has earned you a well-deserved raise of $100!</p>
                            <p>Keep up the great work, and thank you for your dedication.</p>
                            <p>Best Regards,</p>
                            <p><strong>ASM Solutions Informatique et Multimédia</strong></p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 ASM Solutions Informatique et Multimédia. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>';

            $this->emailService->sendMail($email, 'Congratulations !!!', $emailBody);
        } else {
            $this->info('No technicians found.');
        }
    }
}
