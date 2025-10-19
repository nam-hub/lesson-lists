// --- existing elements (kept) ---
    const lessonList = document.getElementById('lessonList');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const frame = document.getElementById('lessonFrame');
    const noteArea = document.getElementById('noteArea');
    const saveNote = document.getElementById('saveNote');
    const timeInfo = document.getElementById('timeInfo');
    const title = document.getElementById('lessonTitle');
    const progressText = document.getElementById('progressText');
    const progressBar = document.querySelector('.progress-bar');

    const quizContainer = document.getElementById('quizContainer');
    const quizTitle = document.getElementById('quizTitle');
    const quizQuestions = document.getElementById('quizQuestions');
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    const quizResult = document.getElementById('quizResult');
    const closeQuizBtn = document.getElementById('closeQuizBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const startTestFromLesson = document.getElementById('startTestFromLesson');

    // --- storage ---
    let notesData = JSON.parse(localStorage.getItem('notesData')) || {};
    let timeData = JSON.parse(localStorage.getItem('timeData')) || {};
    let quizScores = JSON.parse(localStorage.getItem('quizScores')) || {}; // store scores per test (lessonIndex)
    let lastLessonIndex = localStorage.getItem('lastLessonIndex');

    // Build lessons: 20 lessons and 20 tests interleaved -> total 40 items
    const lessons = [];
    // We'll place the 10 real iframes for bài 1..10; bài 11..20 are copies (loop back)
    const realIframes = [
      "https://app.lumi.education/api/v1/run/Tr-f_d/embed",
      "https://app.lumi.education/api/v1/run/KCaIyT/embed",
      "https://app.lumi.education/api/v1/run/LbrXw1/embed",
      "https://app.lumi.education/api/v1/run/iXMRQK/embed",
      "https://app.lumi.education/api/v1/run/5z930d/embed",
      "https://app.lumi.education/api/v1/run/69Trv3/embed",
      "https://app.lumi.education/api/v1/run/G-sfyh/embed",
      "https://app.lumi.education/api/v1/run/9vSs-O/embed",
      "https://app.lumi.education/api/v1/run/gmg1WE/embed",
      "https://app.lumi.education/api/v1/run/OiR7qh/embed"
    ];

    // create lessons array interleaved: Bài 1, Bài kiểm tra 1, Bài 2, Bài kiểm tra 2, ...
    for (let i = 1; i <= 20; i++) {
      lessons.push({ type: 'lesson', title: `Bài ${i}`, idx: i });        // index 0-based position will be used in list
      lessons.push({ type: 'test', title: `Bài kiểm tra ${i}`, idx: i }); // test after each lesson
    }

    // --- QUIZ BANK: 20 tests x 10 questions each (Sinh học THPT style)
    // For tests 1..10, questions follow the real topics. For tests 11..20, repeat topics but different questions.
    // Each question: { q: 'text', options: [{key:'A', text:'...', isCorrect: true/false}, ...] }

    const quizBank = [
      /* Test 1: Khái quát sinh học thực vật */
      [
        { q: "Cấu trúc tế bào thực vật khác tế bào động vật ở điểm nào?", options: [
          {key:'A', text:'Có thành tế bào bằng kitin', isCorrect:false},
          {key:'B', text:'Có thành tế bào bằng xenlulozơ', isCorrect:true},
          {key:'C', text:'Có ty thể nhiều hơn', isCorrect:false},
          {key:'D', text:'Không có màng sinh chất', isCorrect:false}
        ]},
        { q: "Chất dự trữ chủ yếu ở tế bào thực vật là:", options:[
          {key:'A', text:'Glycogen', isCorrect:false},
          {key:'B', text:'Tinh bột', isCorrect:true},
          {key:'C', text:'Glucose', isCorrect:false},
          {key:'D', text:'Protein', isCorrect:false}
        ]},
        { q: "Cấu trúc chịu trách nhiệm vận chuyển nước từ rễ lên lá là:", options:[
          {key:'A', text:'Mạch gỗ (xylem)', isCorrect:true},
          {key:'B', text:'Mạch rây (phloem)', isCorrect:false},
          {key:'C', text:'Cửa khí (stomata)', isCorrect:false},
          {key:'D', text:'Gông gỗ', isCorrect:false}
        ]},
        { q: "Chloroplast chứa sắc tố nào để quang hợp?", options:[
          {key:'A', text:'Chlorophyll', isCorrect:true},
          {key:'B', text:'Hemoglobin', isCorrect:false},
          {key:'C', text:'Melanin', isCorrect:false},
          {key:'D', text:'Carotenoid', isCorrect:false}
        ]},
        { q: "Quy luật phân chia tế bào sinh dưỡng ở thực vật là:", options:[
          {key:'A', text:'Mitosis', isCorrect:true},
          {key:'B', text:'Meiosis', isCorrect:false},
          {key:'C', text:'Binary fission', isCorrect:false},
          {key:'D', text:'Conjugation', isCorrect:false}
        ]},
        { q: "Cơ quan thực vật nào đảm nhận chức năng trao đổi khí chủ yếu?", options:[
          {key:'A', text:'Rễ', isCorrect:false},
          {key:'B', text:'Thân', isCorrect:false},
          {key:'C', text:'Lá', isCorrect:true},
          {key:'D', text:'Hoa', isCorrect:false}
        ]},
        { q: "Mô học: mô phân sinh có chức năng:", options:[
          {key:'A', text:'Dự trữ', isCorrect:false},
          {key:'B', text:'Tăng trưởng (nguyên phát)', isCorrect:true},
          {key:'C', text:'Quang hợp', isCorrect:false},
          {key:'D', text:'Vận chuyển', isCorrect:false}
        ]},
        { q: "Thành phần chính của thành tế bào thực vật là:", options:[
          {key:'A', text:'Protein', isCorrect:false},
          {key:'B', text:'Xenlulozơ', isCorrect:true},
          {key:'C', text:'Lipid', isCorrect:false},
          {key:'D', text:'Nucleic acid', isCorrect:false}
        ]},
        { q: "Thực vật bậc cao dự trữ tinh bột ở cơ quan nào chủ yếu?", options:[
          {key:'A', text:'Lá', isCorrect:false},
          {key:'B', text:'Hạt và rễ', isCorrect:true},
          {key:'C', text:'Mạch gỗ', isCorrect:false},
          {key:'D', text:'Hoa', isCorrect:false}
        ]},
        { q: "Quá trình phân bố chất hữu cơ trong cây thực hiện chủ yếu qua:", options:[
          {key:'A', text:'Mạch gỗ', isCorrect:false},
          {key:'B', text:'Mạch rây (phloem)', isCorrect:true},
          {key:'C', text:'Cutin', isCorrect:false},
          {key:'D', text:'Stomata', isCorrect:false}
        ]}
      ],

      /* Test 2: Quang hợp và trao đổi khí ở thực vật */
      [
        { q: "Sản phẩm cuối cùng của quang hợp trong điều kiện bình thường là:", options:[
          {key:'A', text:'CO2 và H2O', isCorrect:false},
          {key:'B', text:'Glucose và O2', isCorrect:true},
          {key:'C', text:'ATP và NADPH', isCorrect:false},
          {key:'D', text:'O2 và ATP', isCorrect:false}
        ]},
        { q: "Pha tối của quang hợp xảy ra ở:", options:[
          {key:'A', text:'Tilacoit', isCorrect:false},
          {key:'B', text:'Chất nền (stroma) của lục lạp', isCorrect:true},
          {key:'C', text:'Màng sinh chất', isCorrect:false},
          {key:'D', text:'Nhân tế bào', isCorrect:false}
        ]},
        { q: "Yếu tố nào ảnh hưởng trực tiếp đến tốc độ quang hợp?", options:[
          {key:'A', text:'Cường độ ánh sáng', isCorrect:true},
          {key:'B', text:'Áp suất không khí', isCorrect:false},
          {key:'C', text:'Nồng độ muối', isCorrect:false},
          {key:'D', text:'Màu sắc hoa', isCorrect:false}
        ]},
        { q: "Giai đoạn nào tạo ra O2 trong quang hợp?", options:[
          {key:'A', text:'Pha tối (vòng Calvin)', isCorrect:false},
          {key:'B', text:'Phân giải nước ở pha sáng', isCorrect:true},
          {key:'C', text:'Quá trình cố định CO2', isCorrect:false},
          {key:'D', text:'Hô hấp tế bào', isCorrect:false}
        ]},
        { q: "Cửa khí (stomata) có chức năng chính là:", options:[
          {key:'A', text:'Hấp thụ ánh sáng', isCorrect:false},
          {key:'B', text:'Trao đổi khí và thoát hơi nước', isCorrect:true},
          {key:'C', text:'Vận chuyển nhựa', isCorrect:false},
          {key:'D', text:'Quá trình phân bào', isCorrect:false}
        ]},
        { q: "Enzyme chủ yếu tham gia cố định CO2 trong vòng Calvin là:", options:[
          {key:'A', text:'Rubisco', isCorrect:true},
          {key:'B', text:'ATPase', isCorrect:false},
          {key:'C', text:'Polimerase', isCorrect:false},
          {key:'D', text:'Ligase', isCorrect:false}
        ]},
        { q: "Pha sáng của quang hợp diễn ra ở:", options:[
          {key:'A', text:'Stroma', isCorrect:false},
          {key:'B', text:'Tilacoit', isCorrect:true},
          {key:'C', text:'Nhân', isCorrect:false},
          {key:'D', text:'Màng tế bào', isCorrect:false}
        ]},
        { q: "Hiện tượng thoát hơi nước ở thực vật giúp:", options:[
          {key:'A', text:'Tăng cường quang hợp', isCorrect:false},
          {key:'B', text:'Làm mát lá và vận chuyển ion', isCorrect:true},
          {key:'C', text:'Giữ ẩm cho cây', isCorrect:false},
          {key:'D', text:'Tạo sắc tố', isCorrect:false}
        ]},
        { q: "Quá trình quang hợp sử dụng dạng năng lượng nào của ánh sáng?", options:[
          {key:'A', text:'Nhiệt', isCorrect:false},
          {key:'B', text:'Năng lượng photon', isCorrect:true},
          {key:'C', text:'Năng lượng cơ học', isCorrect:false},
          {key:'D', text:'Năng lượng điện', isCorrect:false}
        ]},
        { q: "Ảnh hưởng của CO2 đến quang hợp: khi CO2 tăng tới mức tối ưu thì:", options:[
          {key:'A', text:'Tốc độ quang hợp giảm', isCorrect:false},
          {key:'B', text:'Tốc độ quang hợp tăng đến bão hòa', isCorrect:true},
          {key:'C', text:'Không ảnh hưởng', isCorrect:false},
          {key:'D', text:'Làm chết cây', isCorrect:false}
        ]}
      ],

      /* Test 3: Lọc không khí (thực vật trong đô thị, chức năng lọc khí) */
      [
        { q: "Cây xanh giúp cải thiện chất lượng không khí bằng cách:", options:[
          {key:'A', text:'Giảm O2 trong không khí', isCorrect:false},
          {key:'B', text:'Hấp thụ CO2 và một số chất ô nhiễm', isCorrect:true},
          {key:'C', text:'Phát thải khói', isCorrect:false},
          {key:'D', text:'Tăng nhiệt độ môi trường', isCorrect:false}
        ]},
        { q: "Bề mặt lá có thể giữ bụi và vi hạt nhờ:", options:[
          {key:'A', text:'Cutin và lông mao', isCorrect:true},
          {key:'B', text:'Rễ', isCorrect:false},
          {key:'C', text:'Hạt phấn', isCorrect:false},
          {key:'D', text:'Mạch gỗ', isCorrect:false}
        ]},
        { q: "Loại cây nào thường được dùng trong lọc không khí trong nhà do hiệu quả hấp thụ cao?", options:[
          {key:'A', text:'Cây xương rồng chỉ chịu khô', isCorrect:false},
          {key:'B', text:'Cây nha đam (aloe) và cây lưỡi hổ', isCorrect:true},
          {key:'C', text:'Cây mía', isCorrect:false},
          {key:'D', text:'Cỏ dại', isCorrect:false}
        ]},
        { q: "Thực vật loại bỏ các hợp chất hữu cơ dễ bay hơi (VOCs) nhờ:", options:[
          {key:'A', text:'Quá trình quang hợp trực tiếp', isCorrect:false},
          {key:'B', text:'Tiêu hóa qua rễ', isCorrect:false},
          {key:'C', text:'Sự hấp thụ và chuyển hoá trong mô lá', isCorrect:true},
          {key:'D', text:'Sản xuất oxy', isCorrect:false}
        ]},
        { q: "Cây xanh góp phần giảm hiệu ứng đô thị hóa bằng:", options:[
          {key:'A', text:'Tăng lượng CO2', isCorrect:false},
          {key:'B', text:'Giảm nhiệt độ và giữ ẩm không khí', isCorrect:true},
          {key:'C', text:'Giảm lượng oxy', isCorrect:false},
          {key:'D', text:'Làm cản trở giao thông', isCorrect:false}
        ]},
        { q: "Thành phần nào trên lá giúp thực vật bắt giữ bụi mịn?", options:[
          {key:'A', text:'Stomata mở liên tục', isCorrect:false},
          {key:'B', text:'Lông mao và bề mặt sáp', isCorrect:true},
          {key:'C', text:'Rễ chìa ra', isCorrect:false},
          {key:'D', text:'Hạt phấn', isCorrect:false}
        ]},
        { q: "Cây xanh không thể loại bỏ ô nhiễm nào hiệu quả:", options:[
          {key:'A', text:'CO2', isCorrect:false},
          {key:'B', text:'Một số VOCs', isCorrect:false},
          {key:'C', text:'Tiếng ồn', isCorrect:true},
          {key:'D', text:'Bụi PM10', isCorrect:false}
        ]},
        { q: "Yếu tố nào làm giảm khả năng lọc không khí của cây:", options:[
          {key:'A', text:'Sự che phủ lá lớn', isCorrect:false},
          {key:'B', text:'Ô nhiễm nặng làm hại mô lá', isCorrect:true},
          {key:'C', text:'Độ ẩm phù hợp', isCorrect:false},
          {key:'D', text:'Ánh sáng đầy đủ', isCorrect:false}
        ]},
        { q: "Lọc không khí trong nhà bằng cây trồng thường hiệu quả hơn khi:", options:[
          {key:'A', text:'Số lượng cây ít', isCorrect:false},
          {key:'B', text:'Cây được đặt trong không gian kín và ánh sáng phù hợp', isCorrect:true},
          {key:'C', text:'Không có nước tưới', isCorrect:false},
          {key:'D', text:'Cây bị sâu bệnh', isCorrect:false}
        ]},
        { q: "Một chiến lược để tăng hiệu quả lọc khí đô thị là:", options:[
          {key:'A', text:'Loại bỏ tất cả cây', isCorrect:false},
          {key:'B', text:'Trồng cây phù hợp ở các khu vực nhiều giao thông', isCorrect:true},
          {key:'C', text:'Tăng đốt nhiên liệu', isCorrect:false},
          {key:'D', text:'Giảm diện tích cây xanh', isCorrect:false}
        ]}
      ],

      /* Test 4: Khái quát di truyền học */
      [
        { q: "Đơn vị di truyền cơ bản là:", options:[
          {key:'A', text:'Tế bào', isCorrect:false},
          {key:'B', text:'Nhiễm sắc thể', isCorrect:false},
          {key:'C', text:'Gen', isCorrect:true},
          {key:'D', text:'Protein', isCorrect:false}
        ]},
        { q: "Alen là:", options:[
          {key:'A', text:'Biến thể của một gen', isCorrect:true},
          {key:'B', text:'Một loại tế bào', isCorrect:false},
          {key:'C', text:'Một loại protein', isCorrect:false},
          {key:'D', text:'Một đoạn mRNA', isCorrect:false}
        ]},
        { q: "Luật phân li độc lập được Mendel phát biểu khi nghiên cứu:", options:[
          {key:'A', text:'Một cặp tính trạng', isCorrect:false},
          {key:'B', text:'Hai cặp tính trạng trở lên', isCorrect:true},
          {key:'C', text:'Bào tử nấm', isCorrect:false},
          {key:'D', text:'Phân bào giảm phân', isCorrect:false}
        ]},
        { q: "Kiểu gen đồng hợp tử là:", options:[
          {key:'A', text:'Aa', isCorrect:false},
          {key:'B', text:'AA hoặc aa', isCorrect:true},
          {key:'C', text:'AB', isCorrect:false},
          {key:'D', text:'Không có alen', isCorrect:false}
        ]},
        { q: "Ngoại trừ các trường hợp đặc biệt, gen nằm trên:", options:[
          {key:'A', text:'Ty thể', isCorrect:false},
          {key:'B', text:'Nhiễm sắc thể', isCorrect:true},
          {key:'C', text:'Màng tế bào', isCorrect:false},
          {key:'D', text:'Không gian ngoại bào', isCorrect:false}
        ]},
        { q: "Gen lặn chỉ biểu hiện khi:", options:[
          {key:'A', text:'Có ít nhất một alen trội', isCorrect:false},
          {key:'B', text:'Đồng hợp tử lặn (aa)', isCorrect:true},
          {key:'C', text:'Đột biến ngẫu nhiên', isCorrect:false},
          {key:'D', text:'Khi có môi trường thích hợp', isCorrect:false}
        ]},
        { q: "Phân tích cây phả hệ dùng để:", options:[
          {key:'A', text:'Lập biểu đồ quang hợp', isCorrect:false},
          {key:'B', text:'Xác định kiểu di truyền của một tính trạng trong gia đình', isCorrect:true},
          {key:'C', text:'Tính chiều cao cây', isCorrect:false},
          {key:'D', text:'Đo lượng protein', isCorrect:false}
        ]},
        { q: "Đột biến gen có thể gây ra:", options:[
          {key:'A', text:'Thay đổi trình tự nucleotid', isCorrect:true},
          {key:'B', text:'Thay đổi môi trường sống', isCorrect:false},
          {key:'C', text:'Làm giảm ánh sáng', isCorrect:false},
          {key:'D', text:'Tăng kích thước lá', isCorrect:false}
        ]},
        { q: "Trong tế bào sinh dục, quá trình tạo giao tử xảy ra bởi:", options:[
          {key:'A', text:'Nguyên phân', isCorrect:false},
          {key:'B', text:'Giảm phân (meiosis)', isCorrect:true},
          {key:'C', text:'Trao đổi chất', isCorrect:false},
          {key:'D', text:'Quang hợp', isCorrect:false}
        ]},
        { q: "Gen điều hòa không trực tiếp mã hóa:", options:[
          {key:'A', text:'Protein cấu trúc', isCorrect:false},
          {key:'B', text:'Các yếu tố điều hòa biểu hiện gen', isCorrect:true},
          {key:'C', text:'Lipid', isCorrect:false},
          {key:'D', text:'Tinh bột', isCorrect:false}
        ]}
      ],

      /* Test 5: Ba định luật Mendel */
      [
        { q: "Kết quả lai giữa hai cơ thể đồng hợp tử đối lập cho đời con kiểu hình như thế nào (định luật phân li)?", options:[
          {key:'A', text:'Tất cả đời con giống bố hoặc mẹ', isCorrect:false},
          {key:'B', text:'Tất cả đời con giống bố', isCorrect:false},
          {key:'C', text:'Đời F1 đồng nhất, F2 phân li theo tỉ lệ 3:1 (khi tính trạng trội lặn)', isCorrect:true},
          {key:'D', text:'F1 phân li ngẫu nhiên', isCorrect:false}
        ]},
        { q: "Định luật phân li độc lập nói về:", options:[
          {key:'A', text:'Các cặp alen phân ly độc lập trong quá trình giảm phân', isCorrect:true},
          {key:'B', text:'Alen trội luôn thắng', isCorrect:false},
          {key:'C', text:'Tất cả tính trạng đều lặn', isCorrect:false},
          {key:'D', text:'Gen nằm ở ty thể', isCorrect:false}
        ]},
        { q: "Tỉ lệ kiểu hình F2 từ phép lai phân ly đơn (Aa x Aa) là:", options:[
          {key:'A', text:'1:1', isCorrect:false},
          {key:'B', text:'3:1 (trội:lặn)', isCorrect:true},
          {key:'C', text:'9:7', isCorrect:false},
          {key:'D', text:'2:1', isCorrect:false}
        ]},
        { q: "Ví dụ nào dưới đây minh hoạ định luật phân li?", options:[
          {key:'A', text:'Tạo giao tử', isCorrect:false},
          {key:'B', text:'Aa phân ly thành A và a', isCorrect:true},
          {key:'C', text:'DNA nhân đôi', isCorrect:false},
          {key:'D', text:'Hô hấp tế bào', isCorrect:false}
        ]},
        { q: "Mendel tiến hành thí nghiệm với cây đậu Hà Lan vì:", options:[
          {key:'A', text:'Chu kỳ sống ngắn và nhiều tính trạng dễ quan sát', isCorrect:true},
          {key:'B', text:'Cây này không phân li alen', isCorrect:false},
          {key:'C', text:'Tính trạng không di truyền', isCorrect:false},
          {key:'D', text:'Lý do thí nghiệm trùng hợp', isCorrect:false}
        ]},
        { q: "Nếu lai 2 cặp tính trạng phân ly độc lập, tỉ lệ kiểu hình ở F2 là:", options:[
          {key:'A', text:'9:3:3:1', isCorrect:true},
          {key:'B', text:'3:1', isCorrect:false},
          {key:'C', text:'1:1', isCorrect:false},
          {key:'D', text:'2:1', isCorrect:false}
        ]},
        { q: "Gen trội là:", options:[
          {key:'A', text:'Luôn biểu hiện dù có 1 hay 2 alen', isCorrect:true},
          {key:'B', text:'Luôn ẩn', isCorrect:false},
          {key:'C', text:'Không tồn tại', isCorrect:false},
          {key:'D', text:'Luôn gây chết', isCorrect:false}
        ]},
        { q: "Khi lai AaBb x AaBb (độc lập), xác suất xuất hiện kiểu hình aabb là:", options:[
          {key:'A', text:'1/16', isCorrect:true},
          {key:'B', text:'1/4', isCorrect:false},
          {key:'C', text:'1/8', isCorrect:false},
          {key:'D', text:'3/16', isCorrect:false}
        ]},
        { q: "Phép lai thuận nghịch dùng để kiểm tra:", options:[
          {key:'A', text:'Ảnh hưởng môi trường', isCorrect:false},
          {key:'B', text:'Tính trội hay lặn và tính chất di truyền', isCorrect:true},
          {key:'C', text:'Số nhiễm sắc thể', isCorrect:false},
          {key:'D', text:'Mức độ quang hợp', isCorrect:false}
        ]},
        { q: "Định luật Mendel không đúng hoàn toàn với các tính trạng:", options:[
          {key:'A', text:'Ảnh hưởng bởi nhiều gen (đa gen)', isCorrect:true},
          {key:'B', text:'Đơn gen trội lặn', isCorrect:false},
          {key:'C', text:'Tính trạng nhân đôi', isCorrect:false},
          {key:'D', text:'Tính trạng di truyền đơn giản', isCorrect:false}
        ]}
      ],

      /* Test 6: Phiên mã - dịch mã */
      [
        { q: "Phiên mã là quá trình:", options:[
          {key:'A', text:'Tạo protein từ mRNA', isCorrect:false},
          {key:'B', text:'Tổng hợp mRNA từ ADN', isCorrect:true},
          {key:'C', text:'Nhân đôi ADN', isCorrect:false},
          {key:'D', text:'Phân chia tế bào', isCorrect:false}
        ]},
        { q: "Enzyme thực hiện phiên mã là:", options:[
          {key:'A', text:'DNA polymerase', isCorrect:false},
          {key:'B', text:'RNA polymerase', isCorrect:true},
          {key:'C', text:'Ligase', isCorrect:false},
          {key:'D', text:'Ribozyme', isCorrect:false}
        ]},
        { q: "Mã 3 nuclêôtit trên mRNA gọi là:", options:[
          {key:'A', text:'Codon', isCorrect:true},
          {key:'B', text:'Anticodon', isCorrect:false},
          {key:'C', text:'Promoter', isCorrect:false},
          {key:'D', text:'Stop sequence', isCorrect:false}
        ]},
        { q: "Phân tử mang anticodon để nhận amino acid là:", options:[
          {key:'A', text:'rRNA', isCorrect:false},
          {key:'B', text:'tRNA', isCorrect:true},
          {key:'C', text:'mRNA', isCorrect:false},
          {key:'D', text:'DNA', isCorrect:false}
        ]},
        { q: "Dịch mã kết thúc khi gặp codon nào sau đây:", options:[
          {key:'A', text:'AUG', isCorrect:false},
          {key:'B', text:'UAA/UAG/UGA', isCorrect:true},
          {key:'C', text:'UUU', isCorrect:false},
          {key:'D', text:'UAC', isCorrect:false}
        ]},
        { q: "Mỗi codon mã hóa cho:", options:[
          {key:'A', text:'Một amino acid (hoặc stop)', isCorrect:true},
          {key:'B', text:'Một nucleotide', isCorrect:false},
          {key:'C', text:'Một gene', isCorrect:false},
          {key:'D', text:'Một ribosome', isCorrect:false}
        ]},
        { q: "Khung đọc (reading frame) thay đổi do:", options:[
          {key:'A', text:'Đột biến chèn hoặc trừ 1 hoặc 2 nucleotide', isCorrect:true},
          {key:'B', text:'Đột biến thay thế 1 nucleotide', isCorrect:false},
          {key:'C', text:'Phiên mã', isCorrect:false},
          {key:'D', text:'Sự dịch mã chính xác', isCorrect:false}
        ]},
        { q: "Ribosome được hình thành từ:", options:[
          {key:'A', text:'rRNA và protein', isCorrect:true},
          {key:'B', text:'mRNA và lipid', isCorrect:false},
          {key:'C', text:'tRNA và DNA', isCorrect:false},
          {key:'D', text:'DNA và protein', isCorrect:false}
        ]},
        { q: "Promoter là vùng trên DNA dùng để:", options:[
          {key:'A', text:'Kết thúc phiên mã', isCorrect:false},
          {key:'B', text:'Bắt đầu phiên mã (nơi RNA pol nhận biết)', isCorrect:true},
          {key:'C', text:'Mã hóa protein', isCorrect:false},
          {key:'D', text:'Phân li nhiễm sắc thể', isCorrect:false}
        ]},
        { q: "Trong sinh học phân tử, mã di truyền được gọi là 'thoái hóa' vì:", options:[
          {key:'A', text:'Một codon mã cho nhiều amino acid', isCorrect:false},
          {key:'B', text:'Nhiều codon có thể mã cho cùng một amino acid', isCorrect:true},
          {key:'C', text:'Không có codon stop', isCorrect:false},
          {key:'D', text:'Codon có độ dài khác nhau', isCorrect:false}
        ]}
      ],

      /* Test 7: Đột biến sinh học */
      [
        { q: "Đột biến có thể xảy ra ở cấp độ nào?", options:[
          {key:'A', text:'Gene, nhiễm sắc thể và phân tử', isCorrect:true},
          {key:'B', text:'Chỉ ở bề mặt', isCorrect:false},
          {key:'C', text:'Chỉ trên màng tế bào', isCorrect:false},
          {key:'D', text:'Chỉ trong môi trường', isCorrect:false}
        ]},
        { q: "Đột biến điểm là:", options:[
          {key:'A', text:'Thay đổi 1 nucleotide', isCorrect:true},
          {key:'B', text:'Mất cả nhiễm sắc thể', isCorrect:false},
          {key:'C', text:'Nhân đôi cả bộ gen', isCorrect:false},
          {key:'D', text:'Thay đổi môi trường', isCorrect:false}
        ]},
        { q: "Đột biến có thể được gây ra bởi:", options:[
          {key:'A', text:'Tia phóng xạ và hoá chất gây đột biến', isCorrect:true},
          {key:'B', text:'Ánh sáng nhìn thấy', isCorrect:false},
          {key:'C', text:'Nhiệt độ phòng', isCorrect:false},
          {key:'D', text:'Sự cho ăn', isCorrect:false}
        ]},
        { q: "Đột biến lệch frameshift do:", options:[
          {key:'A', text:'Thay thế 1 nucleotide', isCorrect:false},
          {key:'B', text:'Chèn hoặc mất 1 hoặc 2 nucleotide', isCorrect:true},
          {key:'C', text:'Tách nhiễm sắc thể', isCorrect:false},
          {key:'D', text:'Thay đổi môi trường', isCorrect:false}
        ]},
        { q: "Một số đột biến có lợi cho sinh vật khi:", options:[
          {key:'A', text:'Tăng khả năng thích nghi trong môi trường', isCorrect:true},
          {key:'B', text:'Luôn gây chết', isCorrect:false},
          {key:'C', text:'Làm giảm sự sinh sản', isCorrect:false},
          {key:'D', text:'Làm mất màu sắc', isCorrect:false}
        ]},
        { q: "Đột biến di truyền qua các thế hệ khi xảy ra ở:", options:[
          {key:'A', text:'Tế bào sinh dục', isCorrect:true},
          {key:'B', text:'Tế bào soma', isCorrect:false},
          {key:'C', text:'Mô trưởng thành', isCorrect:false},
          {key:'D', text:'Môi trường', isCorrect:false}
        ]},
        { q: "Đột biến mất đoạn (deletion) ảnh hưởng đến nhiễm sắc thể bằng:", options:[
          {key:'A', text:'Thêm đoạn mới', isCorrect:false},
          {key:'B', text:'Mất một đoạn DNA', isCorrect:true},
          {key:'C', text:'Đảo đoạn', isCorrect:false},
          {key:'D', text:'Không có tác động', isCorrect:false}
        ]},
        { q: "Đột biến lặp đoạn (duplication) có thể dẫn đến:", options:[
          {key:'A', text:'Tăng số bản sao của gen', isCorrect:true},
          {key:'B', text:'Mất hoàn toàn gen', isCorrect:false},
          {key:'C', text:'Giảm số bản sao', isCorrect:false},
          {key:'D', text:'Không ảnh hưởng', isCorrect:false}
        ]},
        { q: "Yếu tố sinh thái nào có thể chọn lọc đột biến có lợi?", options:[
          {key:'A', text:'Áp lực chọn lọc tự nhiên', isCorrect:true},
          {key:'B', text:'Đất sỏi', isCorrect:false},
          {key:'C', text:'Trẻ em', isCorrect:false},
          {key:'D', text:'Ánh sáng yếu', isCorrect:false}
        ]},
        { q: "Một ví dụ thực tế của đột biến có lợi là:", options:[
          {key:'A', text:'Kháng thuốc kháng sinh ở vi khuẩn', isCorrect:true},
          {key:'B', text:'Ung thư', isCorrect:false},
          {key:'C', text:'Mất chức năng đáng kể', isCorrect:false},
          {key:'D', text:'Tăng nhạy cảm với bệnh', isCorrect:false}
        ]}
      ],

      /* Test 8: Khái quát về vi sinh vật */
      [
        { q: "Vi sinh vật bao gồm:", options:[
          {key:'A', text:'Vi khuẩn, nấm, virus, tảo, nguyên sinh', isCorrect:true},
          {key:'B', text:'Chỉ cây và động vật', isCorrect:false},
          {key:'C', text:'Chỉ vi khuẩn', isCorrect:false},
          {key:'D', text:'Chỉ virus', isCorrect:false}
        ]},
        { q: "Điểm khác biệt giữa virus và vi khuẩn:", options:[
          {key:'A', text:'Virus có cấu trúc tế bào hoàn chỉnh', isCorrect:false},
          {key:'B', text:'Virus cần tế bào chủ để nhân lên', isCorrect:true},
          {key:'C', text:'Vi khuẩn luôn ký sinh', isCorrect:false},
          {key:'D', text:'Virus lớn hơn vi khuẩn', isCorrect:false}
        ]},
        { q: "Vi khuẩn Gram dương khác Gram âm ở:", options:[
          {key:'A', text:'Cấu trúc vách tế bào (peptidoglycan dày)', isCorrect:true},
          {key:'B', text:'Có nhân hoàn chỉnh', isCorrect:false},
          {key:'C', text:'Có ty thể', isCorrect:false},
          {key:'D', text:'Không có màng tế bào', isCorrect:false}
        ]},
        { q: "Sinh sản phổ biến ở vi khuẩn là:", options:[
          {key:'A', text:'Nguyên phân', isCorrect:false},
          {key:'B', text:'Phân đôi nhị phân (binary fission)', isCorrect:true},
          {key:'C', text:'Meiosis', isCorrect:false},
          {key:'D', text:'Tạo bào tử', isCorrect:false}
        ]},
        { q: "Vai trò của vi sinh vật trong chu trình nitơ là:", options:[
          {key:'A', text:'Khử nitrat', isCorrect:false},
          {key:'B', text:'Cố định nito, nitrification, denitrification', isCorrect:true},
          {key:'C', text:'Tạo oxy', isCorrect:false},
          {key:'D', text:'Không có vai trò', isCorrect:false}
        ]},
        { q: "Tế bào nấm khác tế bào vi khuẩn ở điểm:", options:[
          {key:'A', text:'Nấm có cấu trúc nhân thật (eukaryote)', isCorrect:true},
          {key:'B', text:'Nấm có vách tế bào bằng xenlulozơ', isCorrect:false},
          {key:'C', text:'Nấm không có màng sinh chất', isCorrect:false},
          {key:'D', text:'Nấm chỉ sống ký sinh', isCorrect:false}
        ]},
        { q: "Một ứng dụng của vi sinh vật trong công nghiệp là:", options:[
          {key:'A', text:'Làm bánh mì và lên men bia rượu', isCorrect:true},
          {key:'B', text:'Làm sắt', isCorrect:false},
          {key:'C', text:'Tạo cây', isCorrect:false},
          {key:'D', text:'Tạo bê tông', isCorrect:false}
        ]},
        { q: "Kháng sinh thường tác động lên:", options:[
          {key:'A', text:'Màng nhân', isCorrect:false},
          {key:'B', text:'Vách tế bào hoặc quy trình sinh tổng hợp protein của vi khuẩn', isCorrect:true},
          {key:'C', text:'Ty thể của vi khuẩn', isCorrect:false},
          {key:'D', text:'Nhiễm sắc thể người', isCorrect:false}
        ]},
        { q: "Quá trình lên men là:", options:[
          {key:'A', text:'Quá trình hiếu khí hoàn toàn', isCorrect:false},
          {key:'B', text:'Quá trình kỵ khí hoặc hiếu khí thiếu oxy để tạo ATP và sản phẩm lên men', isCorrect:true},
          {key:'C', text:'Quá trình phân bào', isCorrect:false},
          {key:'D', text:'Quá trình quang hợp', isCorrect:false}
        ]},
        { q: "Biện pháp kiểm soát vi sinh vật gây bệnh trong thực phẩm là:", options:[
          {key:'A', text:'Bảo quản lạnh và nhiệt độ phù hợp', isCorrect:true},
          {key:'B', text:'Phơi nắng', isCorrect:false},
          {key:'C', text:'Để lâu ở nhiệt độ phòng', isCorrect:false},
          {key:'D', text:'Cho thêm đường', isCorrect:false}
        ]}
      ],

      /* Test 9: Dinh dưỡng vi sinh vật */
      [
        { q: "Nguồn cacbon cho vi sinh vật dị dưỡng là:", options:[
          {key:'A', text:'CO2', isCorrect:false},
          {key:'B', text:'Các hợp chất hữu cơ (glucose,... )', isCorrect:true},
          {key:'C', text:'O2', isCorrect:false},
          {key:'D', text:'N2', isCorrect:false}
        ]},
        { q: "Vi sinh vật tự dưỡng sử dụng nguồn cacbon:", options:[
          {key:'A', text:'CO2', isCorrect:true},
          {key:'B', text:'Chất hữu cơ', isCorrect:false},
          {key:'C', text:'Protein môi trường', isCorrect:false},
          {key:'D', text:'Axit nucleic', isCorrect:false}
        ]},
        { q: "Nhiều vi khuẩn cần yếu tố khoáng vi lượng để:", options:[
          {key:'A', text:'Làm màu', isCorrect:false},
          {key:'B', text:'Hoạt hóa enzyme và chức năng sinh hoá', isCorrect:true},
          {key:'C', text:'Phát sáng', isCorrect:false},
          {key:'D', text:'Không có vai trò', isCorrect:false}
        ]},
        { q: "Quá trình nitrat hóa do vi khuẩn thực hiện là dạng chuyển hóa:", options:[
          {key:'A', text:'Hô hấp năng lượng', isCorrect:true},
          {key:'B', text:'Quang hợp', isCorrect:false},
          {key:'C', text:'Lên men', isCorrect:false},
          {key:'D', text:'Kỵ khí', isCorrect:false}
        ]},
        { q: "Một số vi sinh vật sử dụng lưu huỳnh (S) trong dinh dưỡng để:", options:[
          {key:'A', text:'Tổng hợp amino acid chứa S như cysteine', isCorrect:true},
          {key:'B', text:'Tạo đường', isCorrect:false},
          {key:'C', text:'Hoạt động quang hợp', isCorrect:false},
          {key:'D', text:'Giảm kích thước tế bào', isCorrect:false}
        ]},
        { q: "Vi khuẩn kỵ khí tuyệt đối sống tốt ở:", options:[
          {key:'A', text:'Môi trường giàu oxy', isCorrect:false},
          {key:'B', text:'Môi trường không có oxy', isCorrect:true},
          {key:'C', text:'Môi trường lạnh', isCorrect:false},
          {key:'D', text:'Môi trường axit mạnh', isCorrect:false}
        ]},
        { q: "Lên men là quá trình tạo ATP chủ yếu bằng:", options:[
          {key:'A', text:'Chuỗi hô hấp', isCorrect:false},
          {key:'B', text:'Sản phẩm chuyển hoá không qua oxy (kỵ khí)', isCorrect:true},
          {key:'C', text:'Quang hợp', isCorrect:false},
          {key:'D', text:'Tổng hợp mRNA', isCorrect:false}
        ]},
        { q: "Nguồn nitơ cho vi sinh vật dùng để:", options:[
          {key:'A', text:'Tổng hợp protein và acid nucleic', isCorrect:true},
          {key:'B', text:'Tạo oxy', isCorrect:false},
          {key:'C', text:'Làm đường', isCorrect:false},
          {key:'D', text:'Giữ nước', isCorrect:false}
        ]},
        { q: "Một ví dụ vi sinh vật cố định đạm là:", options:[
          {key:'A', text:'Rhizobium', isCorrect:true},
          {key:'B', text:'E. coli gây hại', isCorrect:false},
          {key:'C', text:'Staphylococcus', isCorrect:false},
          {key:'D', text:'Aspergillus', isCorrect:false}
        ]},
        { q: "Các yếu tố ảnh hưởng đến dinh dưỡng vi sinh vật bao gồm:", options:[
          {key:'A', text:'Nhiệt độ, pH, oxy và nguồn dinh dưỡng', isCorrect:true},
          {key:'B', text:'Màu sắc môi trường', isCorrect:false},
          {key:'C', text:'Số lượng con người', isCorrect:false},
          {key:'D', text:'Kích thước phòng thí nghiệm', isCorrect:false}
        ]}
      ],

      /* Test 10: Cấu tạo vi sinh vật */
      [
        { q: "Cấu trúc vỏ tế bào vi khuẩn được gọi là:", options:[
          {key:'A', text:'Màng nhân', isCorrect:false},
          {key:'B', text:'Vách tế bào (peptidoglycan)', isCorrect:true},
          {key:'C', text:'Ty thể', isCorrect:false},
          {key:'D', text:'Ribosome', isCorrect:false}
        ]},
        { q: "Flagella (lông roi) giúp vi khuẩn:", options:[
          {key:'A', text:'Hô hấp', isCorrect:false},
          {key:'B', text:'Di chuyển', isCorrect:true},
          {key:'C', text:'Tổng hợp protein', isCorrect:false},
          {key:'D', text:'Phân bào', isCorrect:false}
        ]},
        { q: "Plasmid là:", options:[
          {key:'A', text:'Một đoạn DNA nhỏ vòng, không bắt buộc trong vi khuẩn', isCorrect:true},
          {key:'B', text:'Ty thể', isCorrect:false},
          {key:'C', text:'Bào quan của nấm', isCorrect:false},
          {key:'D', text:'Một loại protein', isCorrect:false}
        ]},
        { q: "Ribosome ở vi khuẩn có kích thước:", options:[
          {key:'A', text:'80S', isCorrect:false},
          {key:'B', text:'70S', isCorrect:true},
          {key:'C', text:'90S', isCorrect:false},
          {key:'D', text:'100S', isCorrect:false}
        ]},
        { q: "Capsule (vỏ nhầy) của một số vi khuẩn có chức năng:", options:[
          {key:'A', text:'Tăng khả năng gây bệnh và tránh hệ miễn dịch', isCorrect:true},
          {key:'B', text:'Tổng hợp ADN', isCorrect:false},
          {key:'C', text:'Dự trữ tinh bột', isCorrect:false},
          {key:'D', text:'Quang hợp', isCorrect:false}
        ]},
        { q: "Nhiệm vụ chính của màng tế bào vi khuẩn là:", options:[
          {key:'A', text:'Bảo quản', isCorrect:false},
          {key:'B', text:'Điều hòa vận chuyển chất và trao đổi vật chất', isCorrect:true},
          {key:'C', text:'Quang hợp', isCorrect:false},
          {key:'D', text:'Sao chép ADN', isCorrect:false}
        ]},
        { q: "Một tế bào vi khuẩn điển hình thiếu cấu trúc nào sau đây:", options:[
          {key:'A', text:'Nhân có màng bao (nucleus)', isCorrect:true},
          {key:'B', text:'Ribosome', isCorrect:false},
          {key:'C', text:'Màng tế bào', isCorrect:false},
          {key:'D', text:'Vách tế bào', isCorrect:false}
        ]},
        { q: "Các bào quan chỉ có ở sinh vật nhân thực, không có ở vi khuẩn:", options:[
          {key:'A', text:'Ty thể và lục lạp', isCorrect:true},
          {key:'B', text:'Ribosome', isCorrect:false},
          {key:'C', text:'Plasmid', isCorrect:false},
          {key:'D', text:'Peptidoglycan', isCorrect:false}
        ]},
        { q: "Nhiễm sắc thể của vi khuẩn thường là:", options:[
          {key:'A', text:'Vòng và một bản sao', isCorrect:true},
          {key:'B', text:'Nhiều đoạn linear', isCorrect:false},
          {key:'C', text:'Có nhân hoàn chỉnh', isCorrect:false},
          {key:'D', text:'Không chứa gen', isCorrect:false}
        ]},
        { q: "Phản ứng kháng sinh thường tác động lên:", options:[
          {key:'A', text:'Tế bào chất của người', isCorrect:false},
          {key:'B', text:'Quá trình sinh tổng hợp vách tế bào hoặc protein của vi khuẩn', isCorrect:true},
          {key:'C', text:'Màng nhân', isCorrect:false},
          {key:'D', text:'Mạng lưới nội chất', isCorrect:false}
        ]}
      ],

      /* Tests 11-20: lặp lại chủ đề (1-10) nhưng với câu hỏi khác (dùng mẫu) */
      /* Test 11 => topic of lesson 11 (which is copy of lesson1) */
      [
        { q: "Thực vật CAM thích hợp sống ở môi trường nào?", options:[
          {key:'A', text:'Môi trường khô hạn (CAM giữ CO2 ban đêm)', isCorrect:true},
          {key:'B', text:'Môi trường nước sâu', isCorrect:false},
          {key:'C', text:'Môi trường lạnh', isCorrect:false},
          {key:'D', text:'Môi trường có nhiều dinh dưỡng', isCorrect:false}
        ]},
        { q: "Cấu trúc nào giúp rễ hấp thụ nước hiệu quả hơn?", options:[
          {key:'A', text:'Lá', isCorrect:false},
          {key:'B', text:'Lông hút', isCorrect:true},
          {key:'C', text:'Hoa', isCorrect:false},
          {key:'D', text:'Mạch rây', isCorrect:false}
        ]},
        { q: "Màng sinh chất của tế bào thực vật được cấu tạo chủ yếu từ:", options:[
          {key:'A', text:'Phospholipid', isCorrect:true},
          {key:'B', text:'Xenlulozơ', isCorrect:false},
          {key:'C', text:'Peptidoglycan', isCorrect:false},
          {key:'D', text:'Glycogen', isCorrect:false}
        ]},
        { q: "Thymus là gì (không thuộc thực vật, test kiến thức phân biệt)?", options:[
          {key:'A', text:'Một cơ quan miễn dịch ở động vật', isCorrect:true},
          {key:'B', text:'Một lá cây', isCorrect:false},
          {key:'C', text:'Một loại nấm', isCorrect:false},
          {key:'D', text:'Một vi khuẩn', isCorrect:false}
        ]},
        { q: "Cấy mô thực vật dùng để:", options:[
          {key:'A', text:'Nhân giống vô tính', isCorrect:true},
          {key:'B', text:'Tước đoạt ADN', isCorrect:false},
          {key:'C', text:'Phân tích protein', isCorrect:false},
          {key:'D', text:'Tăng nhiệt độ', isCorrect:false}
        ]},
        { q: "Thực vật CAM có ưu điểm là:", options:[
          {key:'A', text:'Tiết kiệm nước bằng cách đóng stomata ban ngày', isCorrect:true},
          {key:'B', text:'Luôn mở stomata', isCorrect:false},
          {key:'C', text:'Không quang hợp', isCorrect:false},
          {key:'D', text:'Chỉ sống dưới nước', isCorrect:false}
        ]},
        { q: "Mô che phủ của thực vật gồm:", options:[
          {key:'A', text:'Biểu bì, cutin', isCorrect:true},
          {key:'B', text:'Mạch gỗ', isCorrect:false},
          {key:'C', text:'Mô phân sinh', isCorrect:false},
          {key:'D', text:'Rễ', isCorrect:false}
        ]},
        { q: "Vai trò chủ yếu của lục lạp là:", options:[
          {key:'A', text:'Quang hợp', isCorrect:true},
          {key:'B', text:'Hô hấp', isCorrect:false},
          {key:'C', text:'Tổng hợp protein', isCorrect:false},
          {key:'D', text:'Tổng hợp chất béo', isCorrect:false}
        ]},
        { q: "Ở thực vật, tế bào nào chứa nhiều chloroplast nhất?", options:[
          {key:'A', text:'Tế bào mô xốp lá', isCorrect:true},
          {key:'B', text:'Tế bào mạch gỗ', isCorrect:false},
          {key:'C', text:'Tế bào biểu bì rễ', isCorrect:false},
          {key:'D', text:'Tế bào mầm', isCorrect:false}
        ]},
        { q: "Quá trình giãn nở tế bào thực vật chịu ảnh hưởng của:", options:[
          {key:'A', text:'Áp suất thẩm thấu và hormone (auxin)', isCorrect:true},
          {key:'B', text:'Số lượng lá', isCorrect:false},
          {key:'C', text:'Màu hoa', isCorrect:false},
          {key:'D', text:'Số hạt', isCorrect:false}
        ]}
      ],

      /* Test 12 (topic Quang hợp) */
      [
        { q: "Quá trình quang hợp cần những nguyên tố nào sau đây chủ yếu?", options:[
          {key:'A', text:'C, H, O, N, P, S', isCorrect:true},
          {key:'B', text:'Fe, Zn, Cd', isCorrect:false},
          {key:'C', text:'Na, Cl', isCorrect:false},
          {key:'D', text:'K, Mg only', isCorrect:false}
        ]},
        { q: "Chất nhận cuối electron trong pha sáng ở thực vật là:", options:[
          {key:'A', text:'O2', isCorrect:false},
          {key:'B', text:'NADP+', isCorrect:true},
          {key:'C', text:'ATP', isCorrect:false},
          {key:'D', text:'H2O', isCorrect:false}
        ]},
        { q: "Quá trình làm giàu CO2 trong môi trường giúp:", options:[
          {key:'A', text:'Giảm quang hợp', isCorrect:false},
          {key:'B', text:'Tăng quang hợp đến giới hạn', isCorrect:true},
          {key:'C', text:'Không ảnh hưởng', isCorrect:false},
          {key:'D', text:'Làm cây chết', isCorrect:false}
        ]},
        { q: "Carotenoid trong thực vật có vai trò:", options:[
          {key:'A', text:'Chống oxy hóa và hỗ trợ hấp thụ ánh sáng', isCorrect:true},
          {key:'B', text:'Đốt cháy nhiên liệu', isCorrect:false},
          {key:'C', text:'Lọc nước', isCorrect:false},
          {key:'D', text:'Gây độc cho cây', isCorrect:false}
        ]},
        { q: "Quá trình photolysis (phân giải nước) xảy ra ở:", options:[
          {key:'A', text:'PSI', isCorrect:false},
          {key:'B', text:'PSII', isCorrect:true},
          {key:'C', text:'Vòng Calvin', isCorrect:false},
          {key:'D', text:'Lục lạp ngoài', isCorrect:false}
        ]},
        { q: "ATP và NADPH được sử dụng trong:", options:[
          {key:'A', text:'Pha sáng', isCorrect:false},
          {key:'B', text:'Pha tối (vòng Calvin) để tổng hợp đường', isCorrect:true},
          {key:'C', text:'Hô hấp', isCorrect:false},
          {key:'D', text:'Thoát hơi nước', isCorrect:false}
        ]},
        { q: "Ưu điểm của cây C4 so với C3 ở điều kiện nóng và khô là:", options:[
          {key:'A', text:'Tăng hiệu suất cố định CO2 và giảm photorespiration', isCorrect:true},
          {key:'B', text:'Ít ánh sáng hơn', isCorrect:false},
          {key:'C', text:'Không quang hợp', isCorrect:false},
          {key:'D', text:'Không có lợi ích', isCorrect:false}
        ]},
        { q: "Các stomata thường đóng khi:", options:[
          {key:'A', text:'Ban đêm hoặc khi thiếu nước', isCorrect:true},
          {key:'B', text:'Ban ngày khi trời mát', isCorrect:false},
          {key:'C', text:'Khi có nhiều CO2', isCorrect:false},
          {key:'D', text:'Khi trời ẩm', isCorrect:false}
        ]},
        { q: "Quá trình quang hợp tạo ra sản phẩm tạm thời nào để chuyển năng lượng?", options:[
          {key:'A', text:'ATP và NADPH', isCorrect:true},
          {key:'B', text:'DNA', isCorrect:false},
          {key:'C', text:'Protein', isCorrect:false},
          {key:'D', text:'Lipid', isCorrect:false}
        ]},
        { q: "Biện pháp tăng năng suất quang hợp trong nông nghiệp bao gồm:", options:[
          {key:'A', text:'Bón phân phù hợp và quản lý nước', isCorrect:true},
          {key:'B', text:'Giảm ánh sáng', isCorrect:false},
          {key:'C', text:'Trồng ít cây', isCorrect:false},
          {key:'D', text:'Loại bỏ đất', isCorrect:false}
        ]}
      ],

      /* Test 13 (topic Lọc không khí) */
      [
        { q: "Cây xanh giảm ô nhiễm PM bằng cách:", options:[
          {key:'A', text:'Hấp thụ và giữ bụi trên bề mặt lá', isCorrect:true},
          {key:'B', text:'Tạo thêm bụi', isCorrect:false},
          {key:'C', text:'Thải PM ra môi trường', isCorrect:false},
          {key:'D', text:'Đốt cháy PM', isCorrect:false}
        ]},
        { q: "Loại lá có nhiều diện tích bề mặt thường:", options:[
          {key:'A', text:'Bắt bụi tốt hơn', isCorrect:true},
          {key:'B', text:'Cản trở quang hợp', isCorrect:false},
          {key:'C', text:'Không ảnh hưởng', isCorrect:false},
          {key:'D', text:'Gây ô nhiễm', isCorrect:false}
        ]},
        { q: "Chăm sóc cây trong nhà giúp lọc không khí vì:", options:[
          {key:'A', text:'Cây hoạt động không cần dưỡng chất', isCorrect:false},
          {key:'B', text:'Tăng khả năng hấp thụ VOCs và CO2', isCorrect:true},
          {key:'C', text:'Làm tăng nhiệt', isCorrect:false},
          {key:'D', text:'Làm giảm oxy', isCorrect:false}
        ]},
        { q: "Ảnh hưởng tiêu cực tới khả năng lọc không khí của cây là:", options:[
          {key:'A', text:'Sâu bệnh và ô nhiễm nặng làm giảm diện tích lá khỏe', isCorrect:true},
          {key:'B', text:'Tưới nước đầy đủ', isCorrect:false},
          {key:'C', text:'Ánh sáng phù hợp', isCorrect:false},
          {key:'D', text:'Đất tốt', isCorrect:false}
        ]},
        { q: "Cây xếp nào thường dùng cho phòng kín tốt cho lọc khí?", options:[
          {key:'A', text:'Cây cao và lá rộng như Ficus', isCorrect:true},
          {key:'B', text:'Cây ngắn không lá', isCorrect:false},
          {key:'C', text:'Cỏ', isCorrect:false},
          {key:'D', text:'Cây chịu úng', isCorrect:false}
        ]},
        { q: "Một cách tăng hiệu quả lọc không khí đô thị:", options:[
          {key:'A', text:'Trồng cây đơn lẻ thưa thớt', isCorrect:false},
          {key:'B', text:'Tạo và bảo vệ dải cây xanh dọc đường giao thông', isCorrect:true},
          {key:'C', text:'Loại bỏ cây xanh', isCorrect:false},
          {key:'D', text:'Tăng mật độ xe', isCorrect:false}
        ]},
        { q: "Bụi PM2.5 có hại do:", options:[
          {key:'A', text:'Kích thước nhỏ dễ xâm nhập vào phổi', isCorrect:true},
          {key:'B', text:'Lớn và dễ nhìn thấy', isCorrect:false},
          {key:'C', text:'Không tương tác với cơ thể', isCorrect:false},
          {key:'D', text:'Chỉ là nước', isCorrect:false}
        ]},
        { q: "Hiệu quả lọc khí phụ thuộc vào:", options:[
          {key:'A', text:'Loài cây, mật độ, diện tích lá và sức khỏe cây', isCorrect:true},
          {key:'B', text:'Chỉ kích thước cây', isCorrect:false},
          {key:'C', text:'Chỉ chiều cao cây', isCorrect:false},
          {key:'D', text:'Không liên quan đến loài', isCorrect:false}
        ]},
        { q: "Tác động của cây tới giảm ô nhiễm NOx là thông qua:", options:[
          {key:'A', text:'Hấp thụ và chuyển hóa', isCorrect:true},
          {key:'B', text:'Tạo NOx mới', isCorrect:false},
          {key:'C', text:'Thải khí phát quang', isCorrect:false},
          {key:'D', text:'Tăng NOx trong không khí', isCorrect:false}
        ]},
        { q: "Để cây làm sạch không khí trong nhà hiệu quả nên:", options:[
          {key:'A', text:'Đặt số lượng cây phù hợp và chăm sóc tốt', isCorrect:true},
          {key:'B', text:'Để cây chết', isCorrect:false},
          {key:'C', text:'Không tưới', isCorrect:false},
          {key:'D', text:'Đặt cây ngoài trời', isCorrect:false}
        ]}
      ],

      /* Test 14: Di truyền học variant questions */
      [
        { q: "Tỷ lệ phân ly kiểu gen ở F2 cho phép lai Aa x Aa là:", options:[
          {key:'A', text:'1 AA : 2 Aa : 1 aa', isCorrect:true},
          {key:'B', text:'3:1', isCorrect:false},
          {key:'C', text:'1:1', isCorrect:false},
          {key:'D', text:'All same', isCorrect:false}
        ]},
        { q: "Một alen trội là alen:", options:[
          {key:'A', text:'Chỉ biểu hiện khi đồng hợp tử', isCorrect:false},
          {key:'B', text:'Biểu hiện khi có mặt ít nhất một bản', isCorrect:true},
          {key:'C', text:'Luôn lặn', isCorrect:false},
          {key:'D', text:'Không bao giờ biểu hiện', isCorrect:false}
        ]},
        { q: "Nếu một gene có 3 alen (A1,A2,A3), hiện tượng này gọi là:", options:[
          {key:'A', text:'Bội thể', isCorrect:false},
          {key:'B', text:'Đa alen', isCorrect:true},
          {key:'C', text:'Đột biến điểm', isCorrect:false},
          {key:'D', text:'Tái tổ hợp', isCorrect:false}
        ]},
        { q: "Đột biến xoắn ốc (inversion) ảnh hưởng đến nhiễm sắc thể bằng:", options:[
          {key:'A', text:'Đảo một đoạn trên NST', isCorrect:true},
          {key:'B', text:'Mất một đoạn', isCorrect:false},
          {key:'C', text:'Thêm một đoạn', isCorrect:false},
          {key:'D', text:'Không thay đổi', isCorrect:false}
        ]},
        { q: "Sự khác biệt giữa genotype và phenotype là:", options:[
          {key:'A', text:'Genotype là biểu hiện, phenotype là trình tự DNA', isCorrect:false},
          {key:'B', text:'Genotype là kiểu gen, phenotype là kiểu hình', isCorrect:true},
          {key:'C', text:'Không khác nhau', isCorrect:false},
          {key:'D', text:'Phenotype là gen', isCorrect:false}
        ]},
        { q: "Nguồn biến dị nguyên phát trong quần thể là:", options:[
          {key:'A', text:'Đột biến', isCorrect:true},
          {key:'B', text:'Di cư', isCorrect:false},
          {key:'C', text:'Chọn lọc', isCorrect:false},
          {key:'D', text:'Đột biến không quan trọng', isCorrect:false}
        ]},
        { q: "Lai thuận nghịch thường kiểm tra:", options:[
          {key:'A', text:'Ảnh hưởng môi trường và tính trội lặn', isCorrect:true},
          {key:'B', text:'Sức mạnh gen', isCorrect:false},
          {key:'C', text:'Số nhiễm sắc thể', isCorrect:false},
          {key:'D', text:'Màu sắc hoa', isCorrect:false}
        ]},
        { q: "Ảnh hưởng của gen môi trường thể hiện khi:", options:[
          {key:'A', text:'Kiểu hình bị điều chỉnh bởi điều kiện môi trường', isCorrect:true},
          {key:'B', text:'Gen không hoạt động', isCorrect:false},
          {key:'C', text:'Gen biến mất', isCorrect:false},
          {key:'D', text:'Không có ý nghĩa', isCorrect:false}
        ]},
        { q: "Phân ly 3:1 thường thấy ở phép lai:", options:[
          {key:'A', text:'Lai hai đồng hợp tử khác nhau', isCorrect:false},
          {key:'B', text:'Lai Aa x Aa', isCorrect:true},
          {key:'C', text:'Lai Aa x aa', isCorrect:false},
          {key:'D', text:'Lai aa x aa', isCorrect:false}
        ]},
        { q: "Kiểu gen của một cá thể xác định bởi:", options:[
          {key:'A', text:'Sự phối hợp của alen từ bố mẹ', isCorrect:true},
          {key:'B', text:'Chỉ bởi môi trường', isCorrect:false},
          {key:'C', text:'Ngẫu nhiên hoàn toàn', isCorrect:false},
          {key:'D', text:'Không xác định', isCorrect:false}
        ]}
      ],

      /* Test 15: Mendel variant */
      [
        { q: "Lai phân tích dùng để xác định:", options:[
          {key:'A', text:'Kiểu gen của cá thể mang tính trội', isCorrect:true},
          {key:'B', text:'Màu hoa', isCorrect:false},
          {key:'C', text:'Số nhiễm sắc thể', isCorrect:false},
          {key:'D', text:'Độ dài cây', isCorrect:false}
        ]},
        { q: "Nếu lai P: AA x aa → F1: Aa. F1 tự thụ phấn cho F2 thì tỉ lệ kiểu gen sẽ là:", options:[
          {key:'A', text:'1 AA : 2 Aa : 1 aa', isCorrect:true},
          {key:'B', text:'3:1', isCorrect:false},
          {key:'C', text:'1:1', isCorrect:false},
          {key:'D', text:'2:2', isCorrect:false}
        ]},
        { q: "Hai alen trội cùng xuất hiện gọi là:", options:[
          {key:'A', text:'Chồng lấp hoàn toàn', isCorrect:false},
          {key:'B', text:'Tính trạng trội đồng trội', isCorrect:false},
          {key:'C', text:'Cùng xuất hiện (không hoàn toàn)', isCorrect:false},
          {key:'D', text:'Cả hai cùng biểu hiện (co-dominance) tùy trường hợp', isCorrect:true}
        ]},
        { q: "Ở thực vật, lai thuận nghịch kiểm tra được yếu tố nào:", options:[
          {key:'A', text:'Biến dị di truyền', isCorrect:false},
          {key:'B', text:'Tính di truyền và tính ảnh hưởng của bố mẹ', isCorrect:true},
          {key:'C', text:'Số NST', isCorrect:false},
          {key:'D', text:'Độ ẩm', isCorrect:false}
        ]},
        { q: "Lai từ hai tính trạng khác nhau độc lập sẽ cho tỉ lệ:", options:[
          {key:'A', text:'9:3:3:1', isCorrect:true},
          {key:'B', text:'3:1', isCorrect:false},
          {key:'C', text:'1:1', isCorrect:false},
          {key:'D', text:'4:1', isCorrect:false}
        ]},
        { q: "Biến dị tổ hợp xuất hiện do:", options:[
          {key:'A', text:'Đột biến gen', isCorrect:false},
          {key:'B', text:'Tái tổ hợp nhiễm sắc thể và phân li độc lập', isCorrect:true},
          {key:'C', text:'Môi trường', isCorrect:false},
          {key:'D', text:'Ăn uống', isCorrect:false}
        ]},
        { q: "Tại sao Mendel chọn đậu Hà Lan? vì:", options:[
          {key:'A', text:'Nhiều tính trạng rõ ràng, chu kỳ ngắn và dễ lai', isCorrect:true},
          {key:'B', text:'Có nhiều chất dinh dưỡng', isCorrect:false},
          {key:'C', text:'Dễ cháy', isCorrect:false},
          {key:'D', text:'Rất to', isCorrect:false}
        ]},
        { q: "Tính trạng trội hoàn toàn có nghĩa là:", options:[
          {key:'A', text:'Tính trội biểu hiện khi có một bản alen', isCorrect:true},
          {key:'B', text:'Tính lặn biểu hiện khi có một bản', isCorrect:false},
          {key:'C', text:'Không thay đổi', isCorrect:false},
          {key:'D', text:'Tất cả cùng trội', isCorrect:false}
        ]},
        { q: "Kết quả lai phân tích Aa x aa cho tỉ lệ kiểu hình:", options:[
          {key:'A', text:'1 trội : 1 lặn', isCorrect:true},
          {key:'B', text:'3:1', isCorrect:false},
          {key:'C', text:'9:3:3:1', isCorrect:false},
          {key:'D', text:'1:2:1', isCorrect:false}
        ]},
        { q: "Gen nằm trên nhiễm sắc thể quy định:", options:[
          {key:'A', text:'Một vài tính trạng di truyền', isCorrect:true},
          {key:'B', text:'Không liên quan đến di truyền', isCorrect:false},
          {key:'C', text:'Chỉ tính trạng môi trường', isCorrect:false},
          {key:'D', text:'Tạo thức ăn', isCorrect:false}
        ]}
      ],

      /* Test 16: phiên mã/dịch mã variant */
      [
        { q: "Trong quá trình dịch mã, ribosome đọc mRNA từ:", options:[
          {key:'A', text:'3\'→5\'', isCorrect:false},
          {key:'B', text:'5\'→3\'', isCorrect:true},
          {key:'C', text:'Bất kỳ hướng nào', isCorrect:false},
          {key:'D', text:'Không liên quan', isCorrect:false}
        ]},
        { q: "Codon mở đầu trong hầu hết các sinh vật là:", options:[
          {key:'A', text:'UAG', isCorrect:false},
          {key:'B', text:'AUG (methionine)', isCorrect:true},
          {key:'C', text:'UAA', isCorrect:false},
          {key:'D', text:'UGA', isCorrect:false}
        ]},
        { q: "Anticodon trên tRNA tương ứng với codon 5'-AUG-3' là:", options:[
          {key:'A', text:"5'-UAC-3'", isCorrect:true},
          {key:'B', text:"5'-AUG-3'", isCorrect:false},
          {key:'C', text:"5'-GUA-3'", isCorrect:false},
          {key:'D', text:"5'-CAU-3'", isCorrect:false}
        ]},
        { q: "Sai sót trong phiên mã thường ít gây hại hơn sai sót trong:", options:[
          {key:'A', text:'Phiên mã', isCorrect:false},
          {key:'B', text:'ADN gốc (đột biến)', isCorrect:true},
          {key:'C', text:'Dịch mã', isCorrect:false},
          {key:'D', text:'Phân bào', isCorrect:false}
        ]},
        { q: "mRNA sơ khai (pre-mRNA) ở sinh vật nhân thực cần xử lý bằng:", options:[
          {key:'A', text:'Cắt nối (splicing) và đội mũ (capping)', isCorrect:true},
          {key:'B', text:'Tách đôi ADN', isCorrect:false},
          {key:'C', text:'Phân mảnh', isCorrect:false},
          {key:'D', text:'Không cần xử lý', isCorrect:false}
        ]},
        { q: "Rôl của tRNA là:", options:[
          {key:'A', text:'Mang axit amin tương ứng tới ribosome', isCorrect:true},
          {key:'B', text:'Mã hóa protein', isCorrect:false},
          {key:'C', text:'Lưu trữ ADN', isCorrect:false},
          {key:'D', text:'Tạo năng lượng', isCorrect:false}
        ]},
        { q: "Trong bộ ba mã di truyền, mã được gọi là thoái hóa vì:", options:[
          {key:'A', text:'Một codon mã cho nhiều amino acid', isCorrect:false},
          {key:'B', text:'Nhiều codon có thể mã cho cùng amino acid', isCorrect:true},
          {key:'C', text:'Không có mã kết thúc', isCorrect:false},
          {key:'D', text:'Codon thay đổi', isCorrect:false}
        ]},
        { q: "Dịch mã xảy ra ở đâu trong tế bào nhân thực?", options:[
          {key:'A', text:'Trong chất nền tế bào (tế bào chất) trên ribosome', isCorrect:true},
          {key:'B', text:'Trong nhân', isCorrect:false},
          {key:'C', text:'Trong lục lạp', isCorrect:false},
          {key:'D', text:'Trong màng tế bào', isCorrect:false}
        ]},
        { q: "Stop codon không mã hóa cho amino acid nào sau đây:", options:[
          {key:'A', text:'UAA', isCorrect:false},
          {key:'B', text:'UAG', isCorrect:false},
          {key:'C', text:'UGA', isCorrect:false},
          {key:'D', text:'None of these', isCorrect:true}
        ]},
        { q: "Quá trình quay vòng của ribosome trong dịch mã là:", options:[
          {key:'A', text:'Ribosome di chuyển dọc mRNA và ghép amino acid', isCorrect:true},
          {key:'B', text:'Ribosome nhân đôi', isCorrect:false},
          {key:'C', text:'Ribosome giải mã ADN', isCorrect:false},
          {key:'D', text:'Không xảy ra', isCorrect:false}
        ]}
      ],

      /* Test 17: Đột biến variant */
      [
        { q: "Đột biến chuyển đoạn (translocation) trên NST thường là:", options:[
          {key:'A', text:'Một đoạn NST chuyển sang NST khác', isCorrect:true},
          {key:'B', text:'Mất một đoạn', isCorrect:false},
          {key:'C', text:'Thêm một đoạn', isCorrect:false},
          {key:'D', text:'Không có thay đổi', isCorrect:false}
        ]},
        { q: "Đột biến có thể phát sinh tự nhiên trong khi sao chép DNA do:", options:[
          {key:'A', text:'Sơ suất của DNA polymerase', isCorrect:true},
          {key:'B', text:'Sự cố môi trường không liên quan', isCorrect:false},
          {key:'C', text:'Sự cố của ribosome', isCorrect:false},
          {key:'D', text:'Không phát sinh', isCorrect:false}
        ]},
        { q: "Đột biến mất đoạn lớn trên NST có thể dẫn đến:", options:[
          {key:'A', text:'Mất gen quan trọng và bệnh lý', isCorrect:true},
          {key:'B', text:'Tăng sức khỏe hoàn toàn', isCorrect:false},
          {key:'C', text:'Không ảnh hưởng gì', isCorrect:false},
          {key:'D', text:'Làm tăng kích thước cây', isCorrect:false}
        ]},
        { q: "Các yếu tố gây đột biến bao gồm:", options:[
          {key:'A', text:'Tia UV, hóa chất, ion hóa', isCorrect:true},
          {key:'B', text:'Chỉ nhiệt độ', isCorrect:false},
          {key:'C', text:'Ánh sáng nhìn thấy', isCorrect:false},
          {key:'D', text:'Không có yếu tố nào', isCorrect:false}
        ]},
        { q: "Đột biến tiền gen có thể làm thay đổi:", options:[
          {key:'A', text:'Số lượng ribosome', isCorrect:false},
          {key:'B', text:'Trình tự amino acid của protein', isCorrect:true},
          {key:'C', text:'Màu sắc đất', isCorrect:false},
          {key:'D', text:'Ánh sáng', isCorrect:false}
        ]},
        { q: "Đột biến lặp đoạn có thể gây:", options:[
          {key:'A', text:'Mất chức năng gen (do tăng bản sao)', isCorrect:true},
          {key:'B', text:'Tăng chức năng tuyệt đối', isCorrect:false},
          {key:'C', text:'Không có thay đổi', isCorrect:false},
          {key:'D', text:'Tăng tốc quang hợp', isCorrect:false}
        ]},
        { q: "Đột biến lặn chỉ biểu hiện khi:", options:[
          {key:'A', text:'Có một bản alen lặn', isCorrect:false},
          {key:'B', text:'Đồng hợp tử lặn', isCorrect:true},
          {key:'C', text:'Có alen trội', isCorrect:false},
          {key:'D', text:'Luôn biểu hiện', isCorrect:false}
        ]},
        { q: "Đột biến khung đọc thường gây:", options:[
          {key:'A', text:'Thay đổi toàn bộ trình tự amino acid sau chỗ đột biến', isCorrect:true},
          {key:'B', text:'Không ảnh hưởng gì', isCorrect:false},
          {key:'C', text:'Tăng độ bền protein', isCorrect:false},
          {key:'D', text:'Giảm số gen', isCorrect:false}
        ]},
        { q: "Một trong những hậu quả lâu dài của đột biến là:", options:[
          {key:'A', text:'Nguồn biến dị cho tiến hoá', isCorrect:true},
          {key:'B', text:'Không có vai trò', isCorrect:false},
          {key:'C', text:'Chỉ gây bệnh', isCorrect:false},
          {key:'D', text:'Làm mất gen luôn', isCorrect:false}
        ]},
        { q: "Biện pháp giảm rủi ro đột biến do môi trường bao gồm:", options:[
          {key:'A', text:'Giảm phơi nhiễm với tia và chất độc', isCorrect:true},
          {key:'B', text:'Tăng tiếp xúc với hóa chất', isCorrect:false},
          {key:'C', text:'Không có cách nào', isCorrect:false},
          {key:'D', text:'Ăn mặn hơn', isCorrect:false}
        ]}
      ],

      /* Test 18: Vi sinh vật variant */
      [
        { q: "Kháng sinh phổ rộng ảnh hưởng đến:", options:[
          {key:'A', text:'Nhiều loại vi khuẩn khác nhau', isCorrect:true},
          {key:'B', text:'Chỉ một loại vi khuẩn', isCorrect:false},
          {key:'C', text:'Virus', isCorrect:false},
          {key:'D', text:'Nấm', isCorrect:false}
        ]},
        { q: "Phương pháp để xác định vi khuẩn Gram dương hay Gram âm là:", options:[
          {key:'A', text:'Nhuộm Gram', isCorrect:true},
          {key:'B', text:'Nhuộm phân', isCorrect:false},
          {key:'C', text:'Phân tích ADN', isCorrect:false},
          {key:'D', text:'Không có phương pháp', isCorrect:false}
        ]},
        { q: "Quá trình chuyển gen ngang (horizontal gene transfer) ở vi khuẩn bao gồm:", options:[
          {key:'A', text:'Tiếp hợp, biến nạp và biến đổi (conjugation, transduction, transformation)', isCorrect:true},
          {key:'B', text:'Chỉ phân bào', isCorrect:false},
          {key:'C', text:'Có ở động vật', isCorrect:false},
          {key:'D', text:'Không tồn tại', isCorrect:false}
        ]},
        { q: "Biofilm là:", options:[
          {key:'A', text:'Tập hợp vi khuẩn bám bề mặt có chất nền ngoại bào', isCorrect:true},
          {key:'B', text:'Một loại virus', isCorrect:false},
          {key:'C', text:'Mô cây', isCorrect:false},
          {key:'D', text:'Men', isCorrect:false}
        ]},
        { q: "Vai trò của vi sinh vật trong chu trình cacbon là:", options:[
          {key:'A', text:'Phân hủy chất hữu cơ và tái vòng cacbon', isCorrect:true},
          {key:'B', text:'Tạo ra kim loại', isCorrect:false},
          {key:'C', text:'Không có vai trò', isCorrect:false},
          {key:'D', text:'Ngăn cản quang hợp', isCorrect:false}
        ]},
        { q: "Để nuôi cấy vi khuẩn cần môi trường:", options:[
          {key:'A', text:'Cung cấp nguồn C, N, khoáng và pH phù hợp', isCorrect:true},
          {key:'B', text:'Chỉ nước sạch', isCorrect:false},
          {key:'C', text:'Không có dinh dưỡng', isCorrect:false},
          {key:'D', text:'Ánh sáng mạnh', isCorrect:false}
        ]},
        { q: "Một số vi khuẩn dị dưỡng phân hủy chất hữu cơ thành:", options:[
          {key:'A', text:'CO2 và chất vô cơ', isCorrect:true},
          {key:'B', text:'O2', isCorrect:false},
          {key:'C', text:'Protein', isCorrect:false},
          {key:'D', text:'Không phân hủy', isCorrect:false}
        ]},
        { q: "Một ứng dụng y sinh của vi khuẩn là:", options:[
          {key:'A', text:'Sản xuất insulin bằng công nghệ tái tổ hợp', isCorrect:true},
          {key:'B', text:'Tăng bụi mịn', isCorrect:false},
          {key:'C', text:'Tạo acid sulfuric', isCorrect:false},
          {key:'D', text:'Giảm độ ẩm', isCorrect:false}
        ]},
        { q: "Virus khác với vi khuẩn bởi vì virus:", options:[
          {key:'A', text:'Là tế bào hoàn chỉnh', isCorrect:false},
          {key:'B', text:'Phải nhờ tế bào chủ để nhân lên', isCorrect:true},
          {key:'C', text:'Có vách peptidoglycan', isCorrect:false},
          {key:'D', text:'Có ribosome riêng', isCorrect:false}
        ]},
        { q: "Một biện pháp giảm kháng kháng sinh là:", options:[
          {key:'A', text:'Sử dụng kháng sinh đúng chỉ định và đủ liều', isCorrect:true},
          {key:'B', text:'Dùng kháng sinh tùy tiện', isCorrect:false},
          {key:'C', text:'Không tiêm phòng', isCorrect:false},
          {key:'D', text:'Ăn đồ sống', isCorrect:false}
        ]}
      ],

      /* Test 19: Dinh dưỡng vi sinh vật variant */
      [
        { q: "Sinh vật quang tự dưỡng sử dụng:", options:[
          {key:'A', text:'Ánh sáng và CO2 để tổng hợp hữu cơ', isCorrect:true},
          {key:'B', text:'Chỉ chất hữu cơ', isCorrect:false},
          {key:'C', text:'Không cần nguồn C', isCorrect:false},
          {key:'D', text:'Nhiệt', isCorrect:false}
        ]},
        { q: "Vi sinh vật kỵ khí phân giải đường bằng:", options:[
          {key:'A', text:'Hô hấp hiếu khí', isCorrect:false},
          {key:'B', text:'Lên men', isCorrect:true},
          {key:'C', text:'Quang hợp', isCorrect:false},
          {key:'D', text:'Không phân giải', isCorrect:false}
        ]},
        { q: "Nhiều vi khuẩn cần vitamin vì:", options:[
          {key:'A', text:'Vitamin là chất nền enzyme và coenzymes', isCorrect:true},
          {key:'B', text:'Vitamin là nguồn năng lượng chính', isCorrect:false},
          {key:'C', text:'Vitamin tạo thành màng', isCorrect:false},
          {key:'D', text:'Không cần vitamin', isCorrect:false}
        ]},
        { q: "Một chất ức chế sinh tổng hợp vách tế bào (penicillin) sẽ làm:", options:[
          {key:'A', text:'Làm cell wall yếu và tế bào vỡ', isCorrect:true},
          {key:'B', text:'Tạo thêm vách tế bào', isCorrect:false},
          {key:'C', text:'Không ảnh hưởng', isCorrect:false},
          {key:'D', text:'Làm tăng protein', isCorrect:false}
        ]},
        { q: "Vi sinh vật phân giải xenlulozơ chủ yếu là:", options:[
          {key:'A', text:'Một số vi khuẩn và nấm', isCorrect:true},
          {key:'B', text:'Virus', isCorrect:false},
          {key:'C', text:'Động vật', isCorrect:false},
          {key:'D', text:'Không có', isCorrect:false}
        ]},
        { q: "Nitrat hóa là quá trình biến đổi:", options:[
          {key:'A', text:'Ammonia → nitrit → nitrat', isCorrect:true},
          {key:'B', text:'Nitrat → ammonia', isCorrect:false},
          {key:'C', text:'CO2 → glucose', isCorrect:false},
          {key:'D', text:'O2 → O3', isCorrect:false}
        ]},
        { q: "Ứng dụng lên men trong công nghiệp bao gồm:", options:[
          {key:'A', text:'Sản xuất rượu, sữa chua, axit hữu cơ', isCorrect:true},
          {key:'B', text:'Tạo ra kim loại', isCorrect:false},
          {key:'C', text:'Phân hủy kim loại', isCorrect:false},
          {key:'D', text:'Tạo bê tông', isCorrect:false}
        ]},
        { q: "Để nuôi cấy vi khuẩn cần kiểm soát:", options:[
          {key:'A', text:'pH, nhiệt độ, nguồn C và N', isCorrect:true},
          {key:'B', text:'Ánh sáng UV mạnh', isCorrect:false},
          {key:'C', text:'Không khí sạch', isCorrect:false},
          {key:'D', text:'Không có gì', isCorrect:false}
        ]},
        { q: "Sự khác biệt giữa lên men hiếu khí và kỵ khí chủ yếu ở:", options:[
          {key:'A', text:'Sự hiện diện của oxy', isCorrect:true},
          {key:'B', text:'Số lượng proton', isCorrect:false},
          {key:'C', text:'Kích thước tế bào', isCorrect:false},
          {key:'D', text:'Màu sắc', isCorrect:false}
        ]},
        { q: "Vai trò của vi sinh vật trong xử lý nước thải là:", options:[
          {key:'A', text:'Phân hủy chất hữu cơ và chuyển hóa chất độc', isCorrect:true},
          {key:'B', text:'Tăng ô nhiễm', isCorrect:false},
          {key:'C', text:'Không có vai trò', isCorrect:false},
          {key:'D', text:'Giữ nước', isCorrect:false}
        ]}
      ],

      /* Test 20: Cấu tạo vi sinh vật variant */
      [
        { q: "Sự khác biệt giữa tế bào prokaryote và eukaryote là:", options:[
          {key:'A', text:'Prokaryote không có nhân có màng, eukaryote có', isCorrect:true},
          {key:'B', text:'Eukaryote nhỏ hơn', isCorrect:false},
          {key:'C', text:'Prokaryote có ty thể', isCorrect:false},
          {key:'D', text:'Không có khác biệt', isCorrect:false}
        ]},
        { q: "Ribosome ở eukaryote là:", options:[
          {key:'A', text:'80S', isCorrect:true},
          {key:'B', text:'70S', isCorrect:false},
          {key:'C', text:'100S', isCorrect:false},
          {key:'D', text:'Không có', isCorrect:false}
        ]},
        { q: "Plasmid có thể chứa các gen:", options:[
          {key:'A', text:'Kháng kháng sinh', isCorrect:true},
          {key:'B', text:'Tổng hợp hemoglobin', isCorrect:false},
          {key:'C', text:'Tạo ty thể', isCorrect:false},
          {key:'D', text:'Không mã hóa thứ gì', isCorrect:false}
        ]},
        { q: "Biofilm làm cho việc điều trị nhiễm khuẩn khó khăn bởi:", options:[
          {key:'A', text:'Tạo hàng rào bảo vệ và giảm thấm kháng sinh', isCorrect:true},
          {key:'B', text:'Làm tăng oxy', isCorrect:false},
          {key:'C', text:'Làm sạch bề mặt', isCorrect:false},
          {key:'D', text:'Giảm số lượng vi khuẩn', isCorrect:false}
        ]},
        { q: "Các ribozyme là:", options:[
          {key:'A', text:'Protein', isCorrect:false},
          {key:'B', text:'RNA có hoạt tính xúc tác', isCorrect:true},
          {key:'C', text:'DNA', isCorrect:false},
          {key:'D', text:'Lipid', isCorrect:false}
        ]},
        { q: "Một tế bào nhân thực có màng nhân, còn prokaryote thì:", options:[
          {key:'A', text:'Cũng có màng nhân', isCorrect:false},
          {key:'B', text:'Không có màng nhân', isCorrect:true},
          {key:'C', text:'Không có DNA', isCorrect:false},
          {key:'D', text:'Không có RNA', isCorrect:false}
        ]},
        { q: "Capsule vi khuẩn giúp chống lại:", options:[
          {key:'A', text:'Sự thực bào của hệ miễn dịch', isCorrect:true},
          {key:'B', text:'Sự quang hợp', isCorrect:false},
          {key:'C', text:'Tách nhân', isCorrect:false},
          {key:'D', text:'Tạo ATP', isCorrect:false}
        ]},
        { q: "Một số vi khuẩn tạo bào tử khi:", options:[
          {key:'A', text:'Môi trường thuận lợi', isCorrect:false},
          {key:'B', text:'Môi trường khắc nghiệt để tồn tại', isCorrect:true},
          {key:'C', text:'Đang phân chia nhanh', isCorrect:false},
          {key:'D', text:'Không bao giờ', isCorrect:false}
        ]},
        { q: "Plasmid thường được sử dụng trong công nghệ sinh học để:", options:[
          {key:'A', text:'Mang gene ghép và truyền vào vi khuẩn', isCorrect:true},
          {key:'B', text:'Tạo ra vắc xin trực tiếp', isCorrect:false},
          {key:'C', text:'Thay thế ty thể', isCorrect:false},
          {key:'D', text:'Không có ứng dụng', isCorrect:false}
        ]},
        { q: "Peptidoglycan là thành phần của:", options:[
          {key:'A', text:'Vách tế bào vi khuẩn', isCorrect:true},
          {key:'B', text:'Màng nhân', isCorrect:false},
          {key:'C', text:'Lipid màng', isCorrect:false},
          {key:'D', text:'Ribosome', isCorrect:false}
        ]}
      ]
    ]; // end quizBank

    // Utility: shuffle array
    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    // --- Safe localStorage set
    function safeSetLocalStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Không thể lưu vào localStorage:', e);
        alert('Không thể lưu dữ liệu do trình duyệt hạn chế bộ nhớ.');
      }
    }

    // --- Render lesson list (sidebar) ---
    function renderLessons() {
      if (lessonList.children.length === 0) {
        // Chỉ tạo danh sách lần đầu
        lessons.forEach((item, i) => {
          const div = document.createElement('div');
          div.classList.add('lesson');
          div.dataset.id = i;
          const titleSpan = document.createElement('span');
          titleSpan.textContent = item.title;
          const statusSpan = document.createElement('span');
          div.appendChild(titleSpan);
          div.appendChild(statusSpan);
          div.onclick = () => {
            selectLesson(i);
            if (window.innerWidth <= 768) {
              sidebar.classList.remove('open');
              menuToggle.textContent = '☰';
            }
          };
          lessonList.appendChild(div);
        });
      }
      // Cập nhật trạng thái và nội dung
      document.querySelectorAll('.lesson').forEach((div, i) => {
        const statusSpan = div.querySelectorAll('span')[1];
        const rightSide = lessons[i].type === 'test' ? (quizScores[i] ? `Kết quả ${quizScores[i]}/10` : '') : (timeData[i] ? 'Đã xem ✅' : '');
        statusSpan.textContent = rightSide;
        div.classList.toggle('active', !!timeData[i] || !!quizScores[i]);
      });
      updateProgress();
    }

    // helper to get real iframe src for lessonNumber (1..20) -> map to realIframes by modulo
    function getIframeSrcForLessonNumber(n) {
      const idx = (n - 1) % realIframes.length; // 0..9
      return realIframes[idx];
    }

    // --- Select lesson/test ---
    let currentLesson = null;
    let currentQuizState = null; // store rendered quiz structure for retake

    function selectLesson(i) {
      if (i < 0 || i >= lessons.length) return;
      currentLesson = i;
      title.textContent = lessons[i].title;
      document.querySelectorAll('.lesson').forEach(el => el.classList.remove('active'));
      const selected = document.querySelector(`.lesson[data-id="${i}"]`);
      selected.classList.add('active');

      // hide quiz container by default
      hideQuiz();

      // if item is lesson -> show iframe with appropriate src (for bài 1..20 we map)
      if (lessons[i].type === 'lesson') {
        // record first view time if not exist
        if (!timeData[i]) {
          const now = new Date();
          const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} - ${now.getHours()}h${now.getMinutes()}p${now.getSeconds()}s`;
          timeData[i] = timestamp;
          safeSetLocalStorage('timeData', timeData);
        }
        // set iframe src to mapped real iframe for that lesson number
        const lessonNumber = lessons[i].idx; // 1..20
        const newSrc = getIframeSrcForLessonNumber(lessonNumber);
        frame.removeAttribute('srcdoc');
        if (frame.src !== newSrc) {
          frame.classList.add('iframe-loading');
          frame.src = newSrc;
        }
        frame.style.display = '';
        // show "Làm bài kiểm tra" button so user can click to start test
        startTestFromLesson.style.display = 'inline-block';
        startTestFromLesson.onclick = () => {
          // map lesson index i to its corresponding test index: test is at i+1
          const testIndex = i + 1;
          selectLesson(testIndex);
        };
      } else {
        // it's a test -> render quiz in page (hide iframe)
        renderQuizForTestIndex(Math.floor(i / 2)); // testId 0..19
        // hide startTestFromLesson button
        startTestFromLesson.style.display = 'none';
      }

      loadNote(i);
      updateProgress();
      safeSetLocalStorage('lastLessonIndex', currentLesson);
    }

    // --- Load note ---
    function loadNote(i) {
      noteArea.value = notesData[i] || '';
      timeInfo.textContent = timeData[i] ? `✅ಠ⁠,⁠_⁠｣⁠ಠ Bạn đã coi cái này vào lúc: ${timeData[i]}` : '';
    }

    saveNote.onclick = () => {
      if (currentLesson === null || currentLesson < 0 || currentLesson >= lessons.length) return;
      notesData[currentLesson] = noteArea.value;
      safeSetLocalStorage('notesData', notesData);
      alert('Tôi đã nắm được bí mật của bạn muhahahahaaa <3');
    };

    // --- Quiz rendering in page (replaces iframe) ---
    function renderQuizForTestIndex(testId) {
      // testId 0..19; corresponding lessonIndex in list is lessonIndex = testId*2 + 1
      const lessonIndex = testId * 2 + 1;
      const itemTitle = lessons[lessonIndex].title; // e.g. 'Bài kiểm tra 1'
      quizTitle.innerHTML = `<strong>${itemTitle}</strong>`;
      quizQuestions.innerHTML = '';
      quizResult.textContent = '';
      retakeBtn.style.display = 'none';

      // show quiz container and hide iframe
      quizContainer.style.display = 'block';
      quizContainer.setAttribute('aria-hidden','false');
      frame.style.display = 'none';

      // build 10 questions from quizBank[testId]
      const questions = quizBank[testId].map(q=> {
        // deep clone options and shuffle
        const opts = shuffleArray(q.options);
        return { q: q.q, options: opts, originalOptions: q.options };
      });

      currentQuizState = { testId, lessonIndex, questions };

      // render
      questions.forEach((item, idx) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        const qText = document.createElement('div');
        qText.className = 'q-text';
        qText.textContent = `${idx+1}. ${item.q}`;
        qDiv.appendChild(qText);

        const optsDiv = document.createElement('div');
        item.options.forEach((op, oi) => {
          const label = document.createElement('label');
          label.className = 'option';
          label.dataset.key = op.key;
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = `q${idx}`;
          input.value = op.key;
          label.appendChild(input);
          label.appendChild(document.createTextNode(` ${op.text}`));
          optsDiv.appendChild(label);
        });
        qDiv.appendChild(optsDiv);
        quizQuestions.appendChild(qDiv);
      });

      // if previously submitted score exists, show it and mark answers? We'll allow fresh attempt; but show previous score on sidebar
    }

    // hide quiz UI and show iframe
    function hideQuiz() {
      quizContainer.style.display = 'none';
      quizContainer.setAttribute('aria-hidden','true');
      quizQuestions.innerHTML = '';
      quizResult.textContent = '';
      frame.style.display = '';
      retakeBtn.style.display = 'none';
    }

    // submit quiz handling
    submitQuizBtn.addEventListener('click', () => {
      if (!currentQuizState) return;
      const { testId, lessonIndex, questions } = currentQuizState;
      const qDivs = quizQuestions.querySelectorAll('.question');
      const unanswered = Array.from(qDivs).some(qd => !qd.querySelector('input[type=radio]:checked'));
      if (unanswered) {
        alert('Bạn ơi! hãy cố gắng làm hết nhé  (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤');
        return;
      }
      let score = 0;
      // For each question (in DOM), compare selected value to correct key from original options (find correct key)
      qDivs.forEach((qd, idx) => {
        const selected = qd.querySelector('input[type=radio]:checked');
        // find correct key from originalOptions
        // originalOptions array exists on quizBank[testId][idx].options
        const correctObj = quizBank[testId][idx].options.find(o => o.isCorrect);
        const correctKey = correctObj ? correctObj.key : null;
        if (!correctKey) {
          console.warn(`Câu hỏi ${idx + 1} trong bài kiểm tra ${testId} không có đáp án đúng.`);
          return;
        }
        // highlight options
        const optionLabels = qd.querySelectorAll('.option');
        optionLabels.forEach(lbl => {
          const optKey = lbl.dataset.key;
          lbl.classList.remove('correct','wrong');
          lbl.style.pointerEvents = 'none'; // disable change after submit
          if (optKey === correctKey) {
            lbl.classList.add('correct');
          }
        });
        if (selected) {
          const chosenKey = selected.value;
          if (chosenKey === correctKey) {
            score++;
          } else {
            // mark chosen label wrong
            const chosenLabel = qd.querySelector('.option[data-key="'+chosenKey+'"]');
            if (chosenLabel) chosenLabel.classList.add('wrong');
          }
        } else {
          qd.classList.add('unanswered'); // Thêm class để đánh dấu câu chưa trả lời
        }
      });

      // show result
      const percent = Math.round((score / questions.length) * 100);
      quizResult.textContent = `Hoan hô (⁠≧⁠▽⁠≦⁠) ✅ Bạn đúng được ${score}/${questions.length} câu (${percent}%). Vậy là bạn đã giỏi hơn tôi rồi đấy ^^`;

      // save score and time (if first completion for that lessonIndex)
      quizScores[lessonIndex] = score;
      safeSetLocalStorage('quizScores', quizScores);

      if (!timeData[lessonIndex]) {
        const now = new Date();
        const timestamp = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} - ${now.getHours()}h${now.getMinutes()}p${now.getSeconds()}s`;
        timeData[lessonIndex] = timestamp;
        safeSetLocalStorage('timeData', timeData);
      }
      // update sidebar right-side and mark active
      const item = document.querySelector(`.lesson[data-id='${lessonIndex}']`);
      if (item) {
        item.querySelectorAll('span')[1].textContent = `Kết quả ${score}/10`;
        item.classList.add('active');
      }
      // show retake button
      retakeBtn.style.display = 'inline-block';

      // update progress & time info
      if (currentLesson === lessonIndex) loadNote(currentLesson);
      updateProgress();
      renderLessons();
    });

    // retake: re-render quiz with new shuffle (but do not change stored timeData if exists)
    retakeBtn.addEventListener('click', () => {
      if (!currentQuizState) return;
      const { testId } = currentQuizState;
      renderQuizForTestIndex(testId);
      retakeBtn.style.display = 'none';
    });

    // close quiz: hide quiz and show iframe (but keep state)
    closeQuizBtn.addEventListener('click', () => {
      // if currentLesson is a test, navigate back to corresponding lesson (previous item)
      if (currentLesson !== null && lessons[currentLesson] && lessons[currentLesson].type === 'test') {
        // go back to the lesson before this test if exists
        const lessonIndex = currentLesson - 1;
        if (lessonIndex >= 0) selectLesson(lessonIndex);
        else hideQuiz();
      } else {
        hideQuiz();
      }
    });

    // --- Progress update ---
    function updateProgress() {
      const viewed = Object.keys(timeData).length;
      const total = lessons.length; // 40
      const percent = (viewed / total) * 100;
      const offset = 188.4 - (188.4 * percent / 100);
      if (progressBar) progressBar.style.strokeDashoffset = offset;
      progressText.textContent = `${viewed}/${total}`;
    }

    // --- Menu toggle ---
    menuToggle.onclick = () => {
      sidebar.classList.toggle('open');
      menuToggle.textContent = sidebar.classList.contains('open') ? '✖' : '☰';
    };

    // iframe onload remove loading
    frame.onload = () => {
      frame.classList.remove('iframe-loading');
    };

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && currentLesson < lessons.length - 1) {
        selectLesson(currentLesson + 1);
      } else if (e.key === 'ArrowLeft' && currentLesson > 0) {
        selectLesson(currentLesson - 1);
      } else if (e.key === 'Enter' && quizContainer.style.display === 'block') {
        submitQuizBtn.click();
      }
    });

    // initial render
    renderLessons();

    // restore last selected lesson if any
    if (lastLessonIndex !== null) {
      const idx = Number(lastLessonIndex);
      if (!isNaN(idx) && idx >= 0 && idx < lessons.length) {
        setTimeout(() => selectLesson(idx), 100);
      }
    } else {
      // default: open first lesson
      setTimeout(()=>selectLesson(0), 100);
    }

    // remember last when leaving
    window.addEventListener('beforeunload', () => {
      if (currentLesson !== null) safeSetLocalStorage('lastLessonIndex', currentLesson);
    });
