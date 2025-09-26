const vocabularyData = {
    categories: [
        {
            name: "基礎詞彙",
            words: [
                {
                    vietnamese: "xin chào",
                    chinese: "你好",
                    pronunciation: "sin chao",
                    example: "Xin chào bạn! (你好！)",
                    learned: false
                },
                {
                    vietnamese: "cảm ơn",
                    chinese: "謝謝",
                    pronunciation: "kam ən",
                    example: "Cảm ơn bạn rất nhiều! (非常感謝你！)",
                    learned: false
                },
                {
                    vietnamese: "xin lỗi",
                    chinese: "對不起",
                    pronunciation: "sin loi",
                    example: "Xin lỗi, tôi không hiểu. (對不起，我不懂。)",
                    learned: false
                },
                {
                    vietnamese: "tạm biệt",
                    chinese: "再見",
                    pronunciation: "tam biɛt",
                    example: "Tạm biệt, hẹn gặp lại! (再見，下次再見！)",
                    learned: false
                },
                {
                    vietnamese: "bạn",
                    chinese: "你/朋友",
                    pronunciation: "ban",
                    example: "Bạn tên gì? (你叫什麼名字？)",
                    learned: false
                }
            ]
        },
        {
            name: "數字",
            words: [
                {
                    vietnamese: "một",
                    chinese: "一",
                    pronunciation: "moət",
                    example: "Một con mèo (一隻貓)",
                    learned: false
                },
                {
                    vietnamese: "hai",
                    chinese: "二",
                    pronunciation: "hai",
                    example: "Hai quyển sách (兩本書)",
                    learned: false
                },
                {
                    vietnamese: "ba",
                    chinese: "三",
                    pronunciation: "ba",
                    example: "Ba người (三個人)",
                    learned: false
                },
                {
                    vietnamese: "bốn",
                    chinese: "四",
                    pronunciation: "boən",
                    example: "Bốn giờ (四點)",
                    learned: false
                },
                {
                    vietnamese: "năm",
                    chinese: "五",
                    pronunciation: "nam",
                    example: "Năm tuổi (五歲)",
                    learned: false
                }
            ]
        },
        {
            name: "家庭",
            words: [
                {
                    vietnamese: "gia đình",
                    chinese: "家庭",
                    pronunciation: "za diɲ",
                    example: "Gia đình tôi có 4 người (我家有4個人)",
                    learned: false
                },
                {
                    vietnamese: "bố",
                    chinese: "爸爸",
                    pronunciation: "boː",
                    example: "Bố tôi là giáo viên (我爸爸是老師)",
                    learned: false
                },
                {
                    vietnamese: "mẹ",
                    chinese: "媽媽",
                    pronunciation: "mɛ",
                    example: "Mẹ tôi nấu ăn rất ngon (我媽媽煮飯很好吃)",
                    learned: false
                },
                {
                    vietnamese: "anh",
                    chinese: "哥哥/你(敬語)",
                    pronunciation: "aɲ",
                    example: "Anh trai tôi cao lắm (我哥哥很高)",
                    learned: false
                },
                {
                    vietnamese: "chị",
                    chinese: "姐姐/你(敬語)",
                    pronunciation: "ci",
                    example: "Chị gái tôi xinh đẹp (我姐姐很漂亮)",
                    learned: false
                }
            ]
        },
        {
            name: "顏色",
            words: [
                {
                    vietnamese: "màu đỏ",
                    chinese: "紅色",
                    pronunciation: "mau do",
                    example: "Tôi thích màu đỏ (我喜歡紅色)",
                    learned: false
                },
                {
                    vietnamese: "màu xanh",
                    chinese: "藍色/綠色",
                    pronunciation: "mau sanh",
                    example: "Bầu trời màu xanh (天空是藍色的)",
                    learned: false
                },
                {
                    vietnamese: "màu vàng",
                    chinese: "黃色",
                    pronunciation: "mau vang",
                    example: "Hoa màu vàng (黃色的花)",
                    learned: false
                },
                {
                    vietnamese: "màu trắng",
                    chinese: "白色",
                    pronunciation: "mau trang",
                    example: "Áo màu trắng (白色的衣服)",
                    learned: false
                },
                {
                    vietnamese: "màu đen",
                    chinese: "黑色",
                    pronunciation: "mau den",
                    example: "Tóc màu đen (黑色的頭髮)",
                    learned: false
                }
            ]
        },
        {
            name: "時間",
            words: [
                {
                    vietnamese: "giờ",
                    chinese: "點鐘",
                    pronunciation: "zo",
                    example: "Bây giờ là mấy giờ? (現在幾點？)",
                    learned: false
                },
                {
                    vietnamese: "phút",
                    chinese: "分鐘",
                    pronunciation: "fut",
                    example: "Mười phút (十分鐘)",
                    learned: false
                },
                {
                    vietnamese: "hôm nay",
                    chinese: "今天",
                    pronunciation: "hom nay",
                    example: "Hôm nay trời đẹp (今天天氣很好)",
                    learned: false
                },
                {
                    vietnamese: "ngày mai",
                    chinese: "明天",
                    pronunciation: "ngay mai",
                    example: "Ngày mai tôi đi làm (明天我要上班)",
                    learned: false
                },
                {
                    vietnamese: "hôm qua",
                    chinese: "昨天",
                    pronunciation: "hom kwa",
                    example: "Hôm qua tôi ở nhà (昨天我在家)",
                    learned: false
                }
            ]
        },
        {
            name: "天氣",
            words: [
                {
                    vietnamese: "thời tiết",
                    chinese: "天氣",
                    pronunciation: "thoi tiɛt",
                    example: "Thời tiết hôm nay thế nào? (今天天氣怎麼樣？)",
                    learned: false
                },
                {
                    vietnamese: "nắng",
                    chinese: "晴天",
                    pronunciation: "nang",
                    example: "Hôm nay trời nắng (今天是晴天)",
                    learned: false
                },
                {
                    vietnamese: "mưa",
                    chinese: "下雨",
                    pronunciation: "mua",
                    example: "Trời mưa rồi (開始下雨了)",
                    learned: false
                },
                {
                    vietnamese: "lạnh",
                    chinese: "冷",
                    pronunciation: "lanh",
                    example: "Trời lạnh quá (天氣太冷了)",
                    learned: false
                },
                {
                    vietnamese: "nóng",
                    chinese: "熱",
                    pronunciation: "nong",
                    example: "Hè rất nóng (夏天很熱)",
                    learned: false
                }
            ]
        }
    ]
};

const sentenceData = {
    categories: [
        {
            name: "日常對話",
            sentences: [
                {
                    vietnamese: "Bạn có khỏe không?",
                    chinese: "你好嗎？",
                    pronunciation: "ban ko kwe khong",
                    situation: "問候",
                    learned: false
                },
                {
                    vietnamese: "Tôi rất vui được gặp bạn",
                    chinese: "很高興見到你",
                    pronunciation: "toi zət vui duək gap ban",
                    situation: "初次見面",
                    learned: false
                },
                {
                    vietnamese: "Bạn tên là gì?",
                    chinese: "你叫什麼名字？",
                    pronunciation: "ban ten la zi",
                    situation: "自我介紹",
                    learned: false
                },
                {
                    vietnamese: "Tôi đến từ Đài Loan",
                    chinese: "我來自台灣",
                    pronunciation: "toi den tu dai loan",
                    situation: "自我介紹",
                    learned: false
                },
                {
                    vietnamese: "Bao nhiêu tuổi?",
                    chinese: "多少歲？",
                    pronunciation: "bao nhieu tuoi",
                    situation: "詢問年齡",
                    learned: false
                }
            ]
        },
        {
            name: "購物",
            sentences: [
                {
                    vietnamese: "Cái này bao nhiêu tiền?",
                    chinese: "這個多少錢？",
                    pronunciation: "kai nay bao nhieu tien",
                    situation: "詢問價格",
                    learned: false
                },
                {
                    vietnamese: "Tôi muốn mua cái này",
                    chinese: "我想買這個",
                    pronunciation: "toi muon mua kai nay",
                    situation: "購買物品",
                    learned: false
                },
                {
                    vietnamese: "Có thể giảm giá không?",
                    chinese: "可以便宜一點嗎？",
                    pronunciation: "ko the ziam za khong",
                    situation: "討價還價",
                    learned: false
                }
            ]
        },
        {
            name: "餐廳",
            sentences: [
                {
                    vietnamese: "Tôi muốn gọi món",
                    chinese: "我想點餐",
                    pronunciation: "toi muon goi mon",
                    situation: "點餐",
                    learned: false
                },
                {
                    vietnamese: "Món này ngon lắm",
                    chinese: "這道菜很好吃",
                    pronunciation: "mon nay ngon lam",
                    situation: "評價食物",
                    learned: false
                },
                {
                    vietnamese: "Tính tiền",
                    chinese: "結帳",
                    pronunciation: "tinh tien",
                    situation: "結帳",
                    learned: false
                }
            ]
        },
        {
            name: "交通",
            sentences: [
                {
                    vietnamese: "Xe buýt đến chưa?",
                    chinese: "公車到了嗎？",
                    pronunciation: "se buit den chua",
                    situation: "等車",
                    learned: false
                },
                {
                    vietnamese: "Tôi muốn đi đến sân bay",
                    chinese: "我想去機場",
                    pronunciation: "toi muon di den san bay",
                    situation: "搭車",
                    learned: false
                },
                {
                    vietnamese: "Bao nhiêu tiền?",
                    chinese: "多少錢？",
                    pronunciation: "bao nhieu tien",
                    situation: "詢問車資",
                    learned: false
                },
                {
                    vietnamese: "Dừng lại đây",
                    chinese: "停在這裡",
                    pronunciation: "dung lai day",
                    situation: "下車",
                    learned: false
                }
            ]
        },
        {
            name: "住宿",
            sentences: [
                {
                    vietnamese: "Tôi có đặt phòng",
                    chinese: "我有訂房間",
                    pronunciation: "toi ko dat fong",
                    situation: "入住",
                    learned: false
                },
                {
                    vietnamese: "Có phòng trống không?",
                    chinese: "有空房間嗎？",
                    pronunciation: "ko fong trong khong",
                    situation: "詢問房間",
                    learned: false
                },
                {
                    vietnamese: "Wifi mật khẩu là gì?",
                    chinese: "WiFi密碼是什麼？",
                    pronunciation: "wifi mat khau la zi",
                    situation: "詢問設施",
                    learned: false
                }
            ]
        }
    ]
};

const grammarData = {
    topics: [
        {
            name: "基本句型",
            rules: [
                {
                    title: "越南語語序",
                    explanation: "越南語的基本語序是「主語 + 動詞 + 賓語」(SVO)",
                    examples: [
                        {
                            vietnamese: "Tôi ăn cơm",
                            chinese: "我吃飯",
                            breakdown: "我(Tôi) + 吃(ăn) + 飯(cơm)"
                        },
                        {
                            vietnamese: "Bạn đọc sách",
                            chinese: "你讀書",
                            breakdown: "你(Bạn) + 讀(đọc) + 書(sách)"
                        }
                    ]
                },
                {
                    title: "疑問句",
                    explanation: "在句尾加上 'không?' 來形成是非疑問句",
                    examples: [
                        {
                            vietnamese: "Bạn có khỏe không?",
                            chinese: "你好嗎？",
                            breakdown: "你(Bạn) + 有(có) + 好(khỏe) + 嗎(không)?"
                        }
                    ]
                }
            ]
        },
        {
            name: "人稱代詞",
            rules: [
                {
                    title: "基本人稱代詞",
                    explanation: "越南語的人稱代詞會根據年齡和社會地位變化",
                    examples: [
                        {
                            vietnamese: "Tôi, bạn, anh, chị, em",
                            chinese: "我，你，你(男性敬語)，你(女性敬語)，你(年輕人)",
                            breakdown: "根據對方年齡和性別選擇適當的稱謂"
                        }
                    ]
                }
            ]
        }
    ]
};