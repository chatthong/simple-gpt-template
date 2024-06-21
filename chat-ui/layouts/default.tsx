import { Code } from "@nextui-org/react";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3 gap-4">
        <Code color="primary" size="sm">
          รอเพิ่ม: สามารถตอบปัญหาจากรูปภาพได้ แต่ยัง upload ไม่ได้,<br></br>
          ให้วาง URL รูปลงในช่องแชท แล้ว Enter,
          แล้วค่อยถามคำถามต่อจากนั้นเป็นข้อความถัดไป
          <br></br>
          <br></br>
          รอเพิ่ม: Style การตอบยังปรับไม่ได้ หากต้องการปรับ <br></br>
          ให้พิมพ์บอกวิธีการตอบเลย เช่น ให้ตอบสุภาพ
          แล้วตามด้วยคำถามในข้อความเดียวกัน แล้ว Enter
        </Code>
      </footer>
    </div>
  );
}
