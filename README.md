# Node 18+
 npm i / yarn
node .

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
