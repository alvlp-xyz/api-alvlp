<p align="center">
    <img src="https://camo.githubusercontent.com/48ace7370c4494f1a80f851819d7f981bd598c12b27c92020228db4e5a30b4d3/68747470733a2f2f6d656469612e74656e6f722e636f6d2f4659736a7976693343376b41414141692f7275706572742d6361742e676966" width="100%" style="margin-left: auto;margin-right: auto;display: block;">
</p>
<h1 align="center">Simple API</h1>

</p>
<p align="center">
<a href="https://github.com/alvlp-xyz"><img title="Author" src="https://img.shields.io/badge/AUTHOR-alvlp-blue.svg?style=for-the-badge&logo=github"></a>
<a><img src="https://img.shields.io/badge/Maintaned%3F-Actively%20Developed-blue?style=flat-square"></a>
 
[![Kontak](https://img.shields.io/badge/WHATSAPP-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/6285161710084)
[![Kontak](https://img.shields.io/badge/TELEGRAM-0077FF?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/devhunter)


# Installation
install? simple

``` 
git clone https://github.com/alvlp-xyz/api-alvlp && cd api-alvlp
```
```
 npm i 
```
```
 node .
```

# Setup Firestore + Nodemailer App Password  

semua config berada difile .env

## Firebase

1. **Buat Proyek Firebase**  
   - Kunjungi [Firebase Console](https://console.firebase.google.com/).  
   - Klik **Add Project** dan ikuti proses pembuatan proyek (beri nama proyek, pilih Google Analytics jika diperlukan).  

2. **Aktifkan Firestore Database**  
   - Masuk ke proyek yang sudah Anda buat.  
   - Di menu sebelah kiri, pilih **Firestore Database**.  
   - Klik **Create Database**.  
   - Pilih mode keamanan:  
     - **Production Mode** untuk aplikasi live.  
     - **Test Mode** untuk pengembangan (pastikan mengubah aturan sebelum ke produksi).  
   - Klik **Enable** untuk menyelesaikan setup.  

3. **Dapatkan Kunci Service Account**  
   - Masuk ke **Project Settings** (ikon gear di sudut kiri atas).  
   - Pilih tab **Service Accounts**.  
   - Klik tombol **Generate New Private Key**.  
   - File kunci (`.json`) akan diunduh secara otomatis. Buka file json dan copy kedalam .env (pastikan hanya satu baris, next update kupermudah 😅)

---

## 2. **Setup Nodemailer App Password**  
1. **Aktifkan 2FA (Two-Factor Authentication)**  
   - Masuk ke [Google Account Settings](https://myaccount.google.com/).  
   - Di bagian **Security**, aktifkan **2-Step Verification** (ikuti panduan untuk menghubungkan perangkat atau nomor telepon).  

2. **Buat App Password**  
   - Setelah 2FA aktif, kembali ke bagian **Security**.  
   - Pilih **App Passwords** (ada di bawah bagian **Signing in to Google**).  
   - Pilih aplikasi **Mail** dan perangkat **Other (Custom)**, beri nama (misalnya "Nodemailer").  
   - Klik **Generate** untuk mendapatkan App Password.  
   - Simpan App Password ini untuk konfigurasi Nodemailer.

--- 
