export interface DilekceTemplate {
  id: string;
  title: string;
  category: "Özlük & Atama" | "Ek Ders & Mali" | "İzin & Rapor" | "Disiplin & Soruşturma" | "Eğitim & Kurs" | "Genel Dilekçeler";
  recipient: string; // Örn: "İlçe Millî Eğitim Müdürlüğüne"
  summary: string;
  templateContent: string;
  requiredFields: { key: string; label: string; placeholder: string; type: "text" | "date" | "select"; options?: string[] }[];
  legalBasis?: string;
}

export const DILEKCEMATIK_TEMPLATES: DilekceTemplate[] = [
  {
    id: "dil_1",
    title: "Eş Durumu Mazeret Ataması Talebi Dilekçesi",
    category: "Özlük & Atama",
    recipient: "Millî Eğitim Bakanlığı Personel Genel Müdürlüğüne",
    summary: "Eşinin sigortalı veya kamu personeli olması durumunda il dışı eş durumu özür gurubu atama talebi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Ahmet Yılmaz", type: "text" },
      { key: "tcNo", label: "T.C. Kimlik No", placeholder: "11334455667", type: "text" },
      { key: "brans", label: "Branş / Görev", placeholder: "Matematik Öğretmeni", type: "text" },
      { key: "okul", label: "Görev Yapılan Okul", placeholder: "Atatürk Anadolu Lisesi", type: "text" },
      { key: "esKurum", label: "Eşin Kurumu ve Unvanı", placeholder: "Sağlık Bakanlığı - Hemşire", type: "text" },
      { key: "esIl", label: "Eşin Görev Yaptığı İl/İlçe", placeholder: "Ankara / Çankaya", type: "text" },
    ],
    templateContent: `T.C.
MILLÎ EĞİTİM BAKANLIĞI
Personel Genel Müdürlüğüne
(İlçe Millî Eğitim Müdürlüğü Vasıtasıyla)

GÖREV YERİ : {okul}
ADI SOYADI : {adSoyad}
T.C. KİMLİK NO : {tcNo}
BRANŞI / UNVANI : {brans}
KONU : Eş Durumu Mazeretine Bağlı Yer Değiğiştirme Talebi Hk.

İlgi: Millî Eğitim Bakanlığı Öğretmen Atama ve Yer Değiştirme Yönetmeliği.

Yukarıda açık kimliği ve görev yeri belirtilen okulunuzda {brans} olarak görev yapmaktayım. Eşim {esKurum} unvanıyla {esIl} adresinde kamu/sigortalı olarak çalışmaktadır. 

657 Sayılı Devlet Memurları Kanunu ve ilgili atama yönetmeliği hükümleri gereğince aile birliğinin sağlanabilmesi için eşimin görev yaptığı {esIl} iline mazeret atamamin yapılması hususunda gereğini arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_2",
    title: "Eksik Ödenen Ek Ders Ücretinin Hesaplanması ve Ödenmesi Dilekçesi",
    category: "Ek Ders & Mali",
    recipient: "Okul Müdürlüğüne / İlçe MEM",
    summary: "Nöbet, DYK, egzersiz veya normal ders saatlerinde eksik yatan ek ders ücretlerinin düzeltilmesi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Mehmet Demir", type: "text" },
      { key: "tcNo", label: "T.C. Kimlik No", placeholder: "22334455668", type: "text" },
      { key: "brans", label: "Branşı", placeholder: "Türk Dili ve Edebiyatı", type: "text" },
      { key: "okul", label: "Okul Adı", placeholder: "Cumhuriyet Ortaokulu", type: "text" },
      { key: "ayDonem", label: "İlgili Ay / Dönem", placeholder: "2026 Yılı Şubat Ayı", type: "text" },
      { key: "tutar", label: "Tahmini Eksik Tutar (TL)", placeholder: "750", type: "text" },
    ],
    templateContent: `T.C.
................................... OKUL MÜDÜRLÜĞÜNE

ADI SOYADI : {adSoyad}
T.C. KİMLİK NO : {tcNo}
BRANŞI : {brans}
KONU : {ayDonem} Ek Ders Ücreti Hesabı Düzeltme Talebi Hk.

Okulunuzda {brans} öğretmeni olarak görev yapmaktayım. {ayDonem} ait bordro incelendiğinde, fiilen girdiğim ders saatleri, nöbet görevleri ve DYK kurs ücretlerinin eksik tahakkuk ettirildiği tespit edilmiştir. 

Tahmini olarak {tutar} TL tutarında eksik ödenen ek ders ücretimin yeniden incelenerek bordronun düzeltilmesi ve tarafıma ödenmesi hususunda gereğini saygılarımla arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_3",
    title: "Doğum Sonrası Yarı Zamanlı / Ücretsiz İzin Talep Dilekçesi",
    category: "İzin & Rapor",
    recipient: "İlçe Millî Eğitim Müdürlüğüne",
    summary: "Doğum yapan öğretmenlerin 657 sayılı kanun 108. madde kapsamında aylıksız izin veya yarı zamanlı çalışma talebi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Zeynep Kaya", type: "text" },
      { key: "tcNo", label: "T.C. Kimlik No", placeholder: "33445566778", type: "text" },
      { key: "okul", label: "Okul Adı", placeholder: "Fatih İlkokulu", type: "text" },
      { key: "dogumTarihi", label: "Çocuğun Doğum Tarihi", placeholder: "01.05.2026", type: "text" },
      { key: "izinSuresi", label: "İzin Süresi / Dönemi", placeholder: "1 Yıl", type: "text" },
    ],
    templateContent: `T.C.
................................... İLÇE MİLLÎ EĞİTİM MÜDÜRLÜĞÜNE
(................................... Okul Müdürlüğü Vasıtasıyla)

ADI SOYADI : {adSoyad}
T.C. KİMLİK NO : {tcNo}
GÖREV YERİ : {okul}
KONU : Doğum Sonrası Aylıksız / Yarı Zamanlı İzin Talebi.

657 Sayılı Devlet Memurları Kanunu'nun 108. maddesi uyarınca, {dogumTarihi} tarihinde dünyaya gelen çocuğum için {izinSuresi} süreyle aylıksız izin / yarı zamanlı çalışma hakkımı kullanmak istiyorum.

Gereğini ve tensiplerinizi arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_4",
    title: "Disiplin Soruşturmasında Yasal 7 Günlük Savunma Süresi Ek Talebi",
    category: "Disiplin & Soruşturma",
    recipient: "Maarif Müfettişliği / Soruşturmacılığa",
    summary: "Hakkında yürütülen disiplin soruşturmasında dosya incelemesi ve hazırlık için ek süre verilmesi talebi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Mustafa Çelik", type: "text" },
      { key: "tcNo", label: "T.C. Kimlik No", placeholder: "44556677889", type: "text" },
      { key: "sorusturmaNo", label: "Soruşturma / Dosya No", placeholder: "2026/14 Sayılı Soruşturma", type: "text" },
      { key: "ekSure", label: "Talep Edilen Ek Süre (Gün)", placeholder: "7 Gün", type: "text" },
    ],
    templateContent: `T.C.
................................... MAARİF MÜFETTİŞLİĞİ / SORUŞTURMACILIĞINA

ADI SOYADI : {adSoyad}
T.C. KİMLİK NO : {tcNo}
DOSYA / SORUŞTURMA NO : {sorusturmaNo}
KONU : Disiplin Soruşturması Savunma İçin Ek Süre Verilmesi Talebi.

İlgi: .../.../2026 tarihli savunma istem yazınız.

Hakkımda yürütülmekte olan {sorusturmaNo} sayılı soruşturma dosyasındaki iddiaların incelenmesi, tanık ifadelerinin temini ve hukuki savunmamın eksiksiz hazırlanabilmesi için 657 sayılı Kanun Madde 130 uyarınca ek {ekSure} süre verilmesini saygılarımla talep ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_5",
    title: "Destekleme ve Yetiştirme Kursu (DYK) Açılması Teklif Dilekçesi",
    category: "Eğitim & Kurs",
    recipient: "Okul Müdürlüğüne",
    summary: "Öğrencilerin talepleri doğrultusunda hafta sonu veya hafta içi DYK kurs açma teklifi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Fatma Şahin", type: "text" },
      { key: "dersAdi", label: "Ders Adı", placeholder: "Matematik", type: "text" },
      { key: "sinifSeviyesi", label: "Sınıf Seviyesi", placeholder: "8. Sınıf", type: "text" },
      { key: "ogrenciSayisi", label: "Talep Eden Öğrenci Sayısı", placeholder: "22", type: "text" },
    ],
    templateContent: `T.C.
................................... OKUL MÜDÜRLÜĞÜNE

ADI SOYADI : {adSoyad}
BRANŞI : {dersAdi} Öğretmeni
KONU : Destekleme ve Yetiştirme Kursu (DYK) Açılması Talebi.

Okulunuzda görev yapmakta olduğum {dersAdi} dersinden, 2025-2026 eğitim öğretim yılı 2. döneminde {sinifSeviyesi} öğrencilerine yönelik {ogrenciSayisi} öğrencinin imzalı talebiyle Destekleme ve Yetiştirme Kursu (DYK) açılması hususunda gereğini arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_6",
    title: "Hizmet Birleştirme ve Derece/Kademeye Esas Hizmet Puanı İtiraz Dilekçesi",
    category: "Özlük & Atama",
    recipient: "İlçe Millî Eğitim Müdürlüğüne",
    summary: "Özel kurumda veya askerlikte geçen sürelerin memuriyet hizmet birleştirmesine yansıtılması talebi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Ali Öztürk", type: "text" },
      { key: "tcNo", label: "T.C. Kimlik No", placeholder: "55667788990", type: "text" },
      { key: "gecmisKurum", label: "Önceki Hizmet / Kurum", placeholder: "Özel Sektör / Askerlik", type: "text" },
      { key: "sure", label: "Hizmet Süresi (Yıl/Ay)", placeholder: "1 Yıl 6 Ay", type: "text" },
    ],
    templateContent: `T.C.
................................... İLÇE MİLLÎ EĞİTİM MÜDÜRLÜĞÜNE
(................................... Okul Müdürlüğü Vasıtasıyla)

ADI SOYADI : {adSoyad}
T.C. KİMLİK NO : {tcNo}
KONU : Hizmet Birleştirme ve Derece/Kademe İlerlemesi Talebi.

Daha önce {gecmisKurum} olarak geçirmiş olduğum {sure} sürenin, 657 sayılı Kanun Madde 76 ve ilgili mevzuat çerçevesinde memuriyet hizmet birleştirmem yapılarak derece ve kadememe yansıtılması hususunda gereğini arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_7",
    title: "Sendika Üyelik Kesintisi ve Toplu Sözleşme İkramiyesi Başvurusu",
    category: "Genel Dilekçeler",
    recipient: "Okul Müdürlüğüne",
    summary: "Yetkili sendika üyelik işlemlerinin MEBBİS sistemine işlenmesi ve sendika ikramiyesi takibi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyadı", placeholder: "Hakan Korkmaz", type: "text" },
      { key: "sendikaAdi", label: "Sendika Adı", placeholder: "Eğitim-Bir-Sen / Türk Eğitim-Sen", type: "text" },
      { key: "tcNo", label: "T.C. Kimlik No", placeholder: "66778899001", type: "text" },
    ],
    templateContent: `T.C.
................................... OKUL MÜDÜRLÜĞÜNE

ADI SOYADI : {adSoyad}
T.C. KİMLİK NO : {tcNo}
KONU : Sendika Üyelik Bildirimi ve Toplu Sözleşme İkramiyesi Hk.

Üyesi bulunduğum {sendikaAdi} sendikasına ait üyelik formu ilişikte sunulmuştur. Üyelik aidatının maaşımdan kesilmesi ve MEBBİS sistemine işlenerek toplu sözleşme ikramiyesinden yararlandırılmam hususunda gereğini arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  },
  {
    id: "dil_8",
    title: "Yıllık İzin (Mazeret / Rapor Onayı) Talep Dilekçesi",
    category: "İzin & Rapor",
    recipient: "Okul Müdürlüğüne",
    summary: "Mazeret izni veya yıllık mazeret izinlerinin resmi onaya bağlanması talebi.",
    requiredFields: [
      { key: "adSoyad", label: "Adı Soyad", placeholder: "Sibel Aydın", type: "text" },
      { key: "gunSayisi", label: "İzin Süresi (Gün)", placeholder: "3 Gün", type: "text" },
      { key: "baslangicTarihi", label: "İzin Başlangıç Tarihi", placeholder: "15.09.2026", type: "text" },
      { key: "mazeretGerekcesi", label: "Mazeret Gerekçesi", placeholder: "Ailevi mazeret / Sağlık", type: "text" },
    ],
    templateContent: `T.C.
................................... OKUL MÜDÜRLÜĞÜNE

ADI SOYADI : {adSoyad}
KONU : Mazeret İzni Talebi.

{mazeretGerekcesi} nedeniyle {baslangicTarihi} tarihinden itibaren {gunSayisi} süreyle mazeret izni kullanmak istiyorum. Gerekli ders planlaması ve nöbet devir işlemleri tarafımca yapılacaktır.

Gereğini tensiplerinize arz ederim.

Tarih: .../.../2026
İmza:
Ad Soyad: {adSoyad}
`,
  }
];
