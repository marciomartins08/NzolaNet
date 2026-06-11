<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request) : JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ],[
            'email.exists' => 'Este email nao existe no NzolaNet'
        ]);

        $email = $request->email;
        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => $token,
                'created_at' => now()
            ]
        );

        $link = 'http://localhost:4200/reset-password?token='.$token. '&email='. urlencode($email);

        Mail::raw("Olá! Recupera a tua senha da NzolaNet clicando aqui: " . $link, function ($message) use ($email) {
            $message->to($email)
                    ->subject("Recuperação de Senha - NzolaNet");
        });

        return response()->json([
            'message' => 'Link de recuperacao enviado com sucesso'
        ],200);

    }

    public function resetPassword(Request $request) : JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',

        ]);

        $reg = DB::table('password_reset_tokens')
                ->where('email',$request->email)
                ->where('token',$request->token)
                ->first();

        if(!$reg)
            return response()->json(['message' => 'E-mail ou token invalido'],422);

        if(now()->subHours(1)->gt($reg->created_at))
            return response()->json(['message' => 'Esse link expirou a a 1 hora'],422);

        $user = User::where('email', $request->email)->first();

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Senha alterada com sucesso'
        ],200);

    }
}
