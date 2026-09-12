# 2Evrak — Proje Geliştirme Kilit Kuralları (Project Governance & Architecture Mandate)

Bu belgedeki kurallar 2Evrak projesinin tüm geliştirme aşamalarında istisnasız uygulanır.

## Temel Öncelikler Sıralaması
1. **DOĞRULUK**
2. **GÜVENLİK**
3. **PERFORMANS**
4. **SEO**
5. **SADELİK**
6. **ÖLÇEKLENEBİLİRLİK**
7. **BAKIM KOLAYLIĞI**

*(Yeni özellik eklemekten her zaman daha önceliklidir).*

---

## 20 Kilit Kural

1. **Onaylanmış proje mimarisinin dışına çıkma.**
2. **Yeni özellikleri kendiliğinden sisteme ekleme.**
3. **Kapsam dışı bir ihtiyaç tespit edersen kodlama yapma; BACKLOG'a ekle.**
4. **Bir faz tamamlanmadan sonraki faza geçme.**
5. **Çalışan mevcut özellikleri gereksiz yere değiştirme.**
6. **Bir değişiklik mevcut çalışan kodu etkiliyorsa önce etkilenen bağımlılıkları tespit et.**
7. **Her değişiklikten sonra ilgili testleri ve derleme kontrollerini çalıştır.**
8. **Veritabanı migration'larında veri kaybına izin verme.**
9. **Gereksiz tablo, kolon, API, dependency, component veya servis oluşturma.**
10. **Performans, güvenlik ve SEO gereksinimleri her geliştirmede korunacaktır.**
11. **Aynı işlevi yapan ikinci bir sistem oluşturma. Önce mevcut sistemi bul ve onu kullan.**
12. **Eski hatalı yaklaşımı yeni kod içine geri taşıma.**
13. **Kod tekrarını azalt.**
14. **Production ortamında çalışabilecek güvenli mimariyi esas al.**
15. **1 milyon kullanıcı hedefini dikkate al; ancak erken aşamada gereksiz mikroservis ve karmaşıklık oluşturma.**
16. **Ağır işlemleri web request'inden ayır; uygun yerlerde queue/worker kullan.**
17. **Scraper, AI, dosya işleme ve sosyal medya işlemlerini kontrollü ve izlenebilir yap.**
18. **AI tarafından oluşturulan içerik veya belgeler uygun moderasyon sürecinden geçmeden otomatik olarak yayınlanmamalıdır.**
19. **Her modül tamamlandığında önce test et, hataları gider, sonra sonraki modüle geç.**
20. **Bir dosyayı değiştirdiğinde dosyanın güncel ve çalışır tam halini esas al. Eski sürümdeki hatalı kodu geri getirme.**

---

## Her Fazın Sonunda Raporlama Şablonu

Her faz tamamlandığında aşağıdaki formatta rapor sunulacaktır:

- **Tamamlanan işler**
- **Değiştirilen dosyalar**
- **Veritabanı değişiklikleri**
- **API değişiklikleri**
- **Test sonuçları**
- **Çözülen hatalar**
- **Kalan hatalar**
- **Güvenlik durumu**
- **Performans durumu**
- **SEO durumu**
- **Sonraki faz**
