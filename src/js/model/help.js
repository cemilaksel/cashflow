export const getHelpContent = () => {
  return {
    title: "Kullanıcı Senaryosu ve Rehber",
    sections: [
      {
        heading: "1. Başlangıç Ayarları",
        text: "Sol üstteki 'Baz' senaryosu ile başlayın. Mevcut nakit bakiyenizi, başlangıç ayını ve projeksiyon süresini (ay bazında) girin."
      },
      {
        heading: "2. Gelirlerin Tanımlanması",
        text: "Maaş, kira geliri veya yan gelirlerinizi ekleyin. Her gelir için yıllık artış oranı (%) belirleyebilirsiniz. Gelirlerin hangi aylar arasında geçerli olacağını seçebilirsiniz (Örn: 1-12 arası her ay, veya 6-8 arası sadece yaz ayları)."
      },
      {
        heading: "3. Giderlerin Yönetimi",
        text: "Sabit giderlerinizi (kira, faturalar), taksitli ödemelerinizi (kredi kartı taksitleri) ve yıllık giderlerinizi (vergi, sigorta) ayrı ayrı girin. Taksitli ödemelerde başlangıç ayını ve taksit sayısını belirterek nakit akışınızı daha hassas planlayabilirsiniz."
      },
      {
        heading: "4. Faiz ve Birikim",
        text: "Boşta kalan nakitinizin değerlendirileceği faiz oranını girin. Sistem, her ayın başındaki bakiyeniz üzerinden net faiz geliri hesaplar ve bunu toplam gelirinize ekler."
      },
      {
        heading: "5. Analiz ve Dışa Aktarma",
        text: "'Sonuçlar' sekmesine geçerek grafik ve tablo üzerinden nakit akışınızı inceleyin. Verilerinizi Excel'e aktararak daha detaylı analizler yapabilir veya senaryolarınızı JSON olarak kaydedip daha sonra tekrar yükleyebilirsiniz."
      }
    ],
    scenario: {
      title: "Örnek Senaryo: Ev Alımı Planlaması",
      steps: [
        "Mevcut birikiminizi başlangıç bakiyesi olarak girin.",
        "Hedeflediğiniz ev kredisinin aylık taksitini 'Dönemsel Gider' olarak ekleyin (Örn: 120 ay).",
        "Evin tadilat masraflarını ilk aylara 'Sabit Gider' olarak ekleyin.",
        "Sonuçlar ekranında bakiyenizin eksiye düşüp düşmediğini kontrol ederek bütçenizi optimize edin."
      ]
    }
  };
};
