window.addEventListener("load", function () {
    $(".loading").fadeOut(500);
    let sections = $(".section");
    let sectionsType = $(".section-type");
    let headerItems = $(".header-list__item");
    let footerItems = $(".footer-list__item");

    if (window.innerWidth <= 576) {
        $(".search-bar__text").attr("placeholder", "Nhập tên phim...");
    }

    $(".btn-close").click(function () {
        $(".header-list").toggleClass("active");
    });

    $(".btn-open").click(function () {
        $(".header-list").toggleClass("active");
    });

    function hideAllSections(sections) {
        $(".movies-iframe").attr("src", "");
        $(".search-bar__text").val("");
        for (let j = 0; j < sections.length; j++) {
            $(sections[j]).fadeOut(0);
        }
    }

    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            " "
        );
        return str;
    }

    hideAllSections(sections);

    for (let i = 0; i < headerItems.length; i++) {
        $(headerItems[i]).click(function () {
            if (window.innerWidth <= 992) {
                $(".header-list").removeClass("active");
            }
            hideAllSections(sections);
            for (let j = 0; j < headerItems.length; j++)
                $(headerItems[j]).removeClass("active");
            $(sectionsType[i]).fadeIn(0);
            $(headerItems[i]).addClass("active");
        });
    }

    for (let i = 0; i < footerItems.length; i++) {
        $(footerItems[i]).click(function () {
            hideAllSections(sections);
            $(sectionsType[i + 1]).fadeIn(0);
        });
    }

    fetch(
        "https://api.apify.com/v2/key-value-stores/QubTry45OOCkTyohU/records/LATEST?fbclid=IwAR2nEDQLxlTcxnTK9EWUrfFUrGklIJuGxRHYSwCl1MUiTGUO5QmS0XBngBs"
    ).then(async (res) => {
        const data = await res.json();
        const PHIM = Object.entries(data.phim);
        const phimBo = PHIM[0][1];
        const phimLe = PHIM[1][1];
        const phimChieuRap = PHIM[2][1];
        const phimHoatHinh = PHIM[3][1];

        $(sectionsType[0]).fadeIn(0);
        $(".loading-screen").fadeOut(0);

        let NUMBER_FILM_PER_PAGE;

        if (window.innerWidth >= 992) NUMBER_FILM_PER_PAGE = 30;
        else if (window.innerWidth >= 576) NUMBER_FILM_PER_PAGE = 20;
        else NUMBER_FILM_PER_PAGE = 10;

        let ketQuaTimKiem = [];

        let phimBoIndex = 0,
            phimLeIndex = 0,
            phimHoatHinhIndex = 0,
            phimChieuRapIndex = 0,
            phimTimKiemIndex = 0;

        function addClickEventForfilmItems() {
            for (let i = 0; i < $(".phim-list__item").length; i++) {
                $($(".phim-list__item")[i]).click(function () {
                    hideAllSections(sections);
                    $(".xemPhim").fadeIn(0);
                    $(".movies-iframe").attr("src", "");
                    $(".movies-episodes").html("");
                    let index = Number.parseInt($(this).attr("data-index"));
                    let theloai = $(this).attr("data-theloai");
                    if (theloai === "phimChieuRap" || theloai === "phimLe") {
                        let movieName, movieUrl, episodes;

                        $(".movies-list-title").fadeOut(0);

                        if (theloai === "phimChieuRap") {
                            episodes = phimChieuRap[index].episode;
                        } else {
                            episodes = phimLe[index].episode;
                        }

                        if (episodes.length > 0) {
                            if (theloai === "phimChieuRap") {
                                movieName = phimChieuRap[index].title;
                                movieUrl = phimChieuRap[index].episode[0].url;
                            } else {
                                movieName = phimLe[index].title;
                                movieUrl = phimLe[index].episode[0].url;
                            }

                            console.log(theloai, index);
                            $(".movies-iframe").attr("src", movieUrl);
                            $(".movies-name").html(
                                "XEM PHIM " + movieName.toUpperCase()
                            );
                        } else {
                            $(".movies-name").html(
                                "PHIM HIỆN ĐANG ĐƯỢC CẬP NHẬT, VUI LÒNG QUAY LẠI SAU"
                            );
                            $(".movies-details").fadeOut(0);
                        }
                    }

                    if (theloai === "phimBo" || theloai === "phimHoatHinh") {
                        $(".movies-list-title").fadeIn(0);
                        let episodes;
                        if (theloai === "phimBo") {
                            episodes = phimBo[index].episode;
                        } else {
                            episodes = phimHoatHinh[index].episode;
                        }

                        if (episodes.length > 0) {
                            let movieName, movieUrl, episodeNumber;
                            $(".movies-details").fadeIn(0);
                            if (theloai === "phimBo") {
                                movieName = phimBo[index].title;
                                movieUrl = phimBo[index].episode[0].url;
                            } else {
                                movieName = phimHoatHinh[index].title;
                                movieUrl = phimHoatHinh[index].episode[0].url;
                            }
                            $(".movies-iframe").attr("src", movieUrl);

                            if (theloai === "phimBo")
                                episodeNumber =
                                    phimBo[index].episode[0].episode;
                            else
                                episodeNumber =
                                    phimHoatHinh[index].episode[0].episode;

                            $(".movies-name").html(
                                "XEM PHIM " +
                                    movieName.toUpperCase() +
                                    ` TẬP ` +
                                    episodeNumber +
                                    ":"
                            );

                            for (let j = 0; j < episodes.length; j++) {
                                if (theloai === "phimBo")
                                    episodeNumber =
                                        phimBo[index].episode[j].episode;
                                else
                                    episodeNumber =
                                        phimHoatHinh[index].episode[j].episode;

                                if (j == 0) {
                                    $(".movies-episodes").html(
                                        $(".movies-episodes").html() +
                                            `<li class="movies-episodes__item active" data-url=${episodes[j].url}>${episodeNumber}</li>`
                                    );
                                } else {
                                    $(".movies-episodes").html(
                                        $(".movies-episodes").html() +
                                            `<li class="movies-episodes__item" data-url=${episodes[j].url}>${episodeNumber}</li>`
                                    );
                                }
                            }

                            for (
                                let j = 0;
                                j < $(".movies-episodes__item").length;
                                j++
                            ) {
                                $($(".movies-episodes__item")[j]).click(
                                    function () {
                                        if (theloai === "phimBo")
                                            episodeNumber =
                                                phimBo[index].episode[j]
                                                    .episode;
                                        else
                                            episodeNumber =
                                                phimHoatHinh[index].episode[j]
                                                    .episode;

                                        $(".movies-name").html(
                                            "XEM PHIM " +
                                                movieName.toUpperCase() +
                                                ` TẬP ` +
                                                episodeNumber +
                                                ":"
                                        );
                                        let movieUrl = $(this).attr("data-url");
                                        $(".movies-iframe").attr(
                                            "src",
                                            movieUrl
                                        );

                                        for (
                                            let k = 0;
                                            k <
                                            $(".movies-episodes__item").length;
                                            k++
                                        ) {
                                            $(
                                                $(".movies-episodes__item")[k]
                                            ).removeClass("active");
                                        }
                                        $(
                                            $(".movies-episodes__item")[j]
                                        ).addClass("active");
                                    }
                                );
                            }
                        } else {
                            $(".movies-name").html(
                                "PHIM HIỆN ĐANG ĐƯỢC CẬP NHẬT, VUI LÒNG QUAY LẠI SAU"
                            );
                            $(".movies-details").fadeOut(0);
                        }
                    }
                });
            }
        }

        function renderPhim(
            index,
            numberPerPage,
            phimList,
            classPhimList,
            theloai
        ) {
            for (
                let i = index * numberPerPage;
                i < index * numberPerPage + numberPerPage;
                i++
            ) {
                if (i >= phimList.length) break;
                $(classPhimList).html(
                    $(classPhimList).html() +
                        `<li class="phim-list__item" data-index=${i} data-theloai=${theloai}>
						<img src="${phimList[i].imageUrl}" alt="${phimList[i].title}" />
						<h4>${phimList[i].title}</h4>
						<div class="info-tag">
							<img src="./img/tag-icon.png" alt="tag" />
							<span>${phimList[i].category}</span>
						</div>
					</li>`
                );
            }

            addClickEventForfilmItems();
        }

        function searchPhimByType(phimList, ketQuaTimKiem, type, filter) {
            for (let i = 0; i < phimList.length; i++) {
                let tenPhim = removeVietnameseTones(
                    phimList[i].title
                ).toLowerCase();

                let category = removeVietnameseTones(
                    phimList[i].category
                ).toLowerCase();

                if (tenPhim.includes(filter) || category.includes(filter)) {
                    ketQuaTimKiem.push({
                        phim: phimList[i],
                        index: i,
                        theloai: type,
                    });
                }
            }
        }

        function renderFoundFilms(ketQuaTimKiem, index, timKiemList) {
            $(timKiemList).html(
                $(timKiemList).html() +
                    `<li class="phim-list__item" data-index=${ketQuaTimKiem[index].index} data-theloai=${ketQuaTimKiem[index].theloai}>
					<img src="${ketQuaTimKiem[index].phim.imageUrl}" alt="${ketQuaTimKiem[index].phim.title}" />
					<h4>${ketQuaTimKiem[index].phim.title}</h4>
					<div class="info-tag">
						<img src="./img/tag-icon.png" alt="tag" />
						<span>${ketQuaTimKiem[index].phim.category}</span>
					</div>
				</li>`
            );
        }

        function searchFilm() {
            let originalFilter = $(".search-bar__text").val();

            if (originalFilter.length < 2) {
                alert("Vui lòng nhập từ khóa có độ dài tối thiểu 2 ký tự!");
            } else {
                ketQuaTimKiem = [];
                hideAllSections(sections);
                $(".timKiem").fadeIn(0);
                let filter =
                    removeVietnameseTones(originalFilter).toLowerCase();

                $(".search-bar__text").val("");

                searchPhimByType(phimBo, ketQuaTimKiem, "phimBo", filter);
                searchPhimByType(phimLe, ketQuaTimKiem, "phimLe", filter);
                searchPhimByType(
                    phimHoatHinh,
                    ketQuaTimKiem,
                    "phimHoatHinh",
                    filter
                );
                searchPhimByType(
                    phimChieuRap,
                    ketQuaTimKiem,
                    "phimChieuRap",
                    filter
                );

                if (ketQuaTimKiem.length) {
                    $(".search-result").html(
                        "KẾT QUẢ TÌM KIẾM " + `"${originalFilter}"`
                    );
                    $(".timKiem-list").html("");

                    let size = ketQuaTimKiem.length;

                    if (size <= 30) {
                        $(".timKiem__button").fadeOut(0);
                        for (let i = 0; i < size; i++) {
                            renderFoundFilms(ketQuaTimKiem, i, ".timKiem-list");
                        }
                        addClickEventForfilmItems();
                    } else {
                        for (let i = 0; i < 30; i++) {
                            renderFoundFilms(ketQuaTimKiem, i, ".timKiem-list");
                        }

                        $(".timKiem__button").fadeIn(0);

                        $(".button-timkiem-next").click(function () {
                            if (
                                phimTimKiemIndex <
                                ketQuaTimKiem.length / NUMBER_FILM_PER_PAGE - 1
                            )
                                phimTimKiemIndex++;
                            $(".timKiem-list").html("");
                            for (
                                let i = NUMBER_FILM_PER_PAGE * phimTimKiemIndex;
                                i <
                                NUMBER_FILM_PER_PAGE * phimTimKiemIndex + 30;
                                i++
                            ) {
                                if (i >= ketQuaTimKiem.length) break;
                                renderFoundFilms(
                                    ketQuaTimKiem,
                                    i,
                                    ".timKiem-list"
                                );
                            }
                            deactivateControlButton(
                                phimTimKiemIndex,
                                ketQuaTimKiem,
                                ".button-timkiem-prev",
                                ".button-timkiem-next"
                            );
                            addClickEventForfilmItems();
                        });

                        $(".button-timkiem-prev").click(function () {
                            if (phimTimKiemIndex > 0) phimTimKiemIndex--;
                            $(".timKiem-list").html("");
                            for (
                                let i = NUMBER_FILM_PER_PAGE * phimTimKiemIndex;
                                i <
                                NUMBER_FILM_PER_PAGE * phimTimKiemIndex + 30;
                                i++
                            ) {
                                if (i >= ketQuaTimKiem.length) break;
                                renderFoundFilms(
                                    ketQuaTimKiem,
                                    i,
                                    ".timKiem-list"
                                );
                            }
                            deactivateControlButton(
                                phimTimKiemIndex,
                                ketQuaTimKiem,
                                ".button-timkiem-prev",
                                ".button-timkiem-next"
                            );
                            addClickEventForfilmItems();
                        });

                        addClickEventForfilmItems();
                    }
                } else {
                    $(".search-result").html("KHÔNG TÌM THẤY PHIM BẠN YÊU CẦU");
                    $(".timKiem-list").html("");
                    $(".timKiem__button").fadeOut(0);
                }
            }
        }

        //search
        $(".search-bar__submit").click(function () {
            searchFilm();
        });

        $(".search-bar__text").keydown(function (e) {
            if (e.keyCode === 13) searchFilm();
        });

        renderPhim(0, 10, phimBo, ".phimBoMoi-list", "phimBo");
        renderPhim(0, 10, phimLe, ".phimLeMoi-list", "phimLe");
        renderPhim(
            0,
            10,
            phimChieuRap,
            ".phimChieuRapMoi-list",
            "phimChieuRap"
        );
        renderPhim(
            0,
            10,
            phimHoatHinh,
            ".phimHoatHinhMoi-list",
            "phimHoatHinh"
        );

        renderPhim(0, NUMBER_FILM_PER_PAGE, phimBo, ".phimBo-list", "phimBo");
        renderPhim(0, NUMBER_FILM_PER_PAGE, phimLe, ".phimLe-list", "phimLe");
        renderPhim(
            0,
            NUMBER_FILM_PER_PAGE,
            phimChieuRap,
            ".phimChieuRap-list",
            "phimChieuRap"
        );
        renderPhim(
            0,
            NUMBER_FILM_PER_PAGE,
            phimHoatHinh,
            ".phimHoatHinh-list",
            "phimHoatHinh"
        );

        function controlFilms(
            phimIndex,
            phimList,
            phimListName,
            isIncrease,
            type
        ) {
            if (
                phimIndex < phimList.length / NUMBER_FILM_PER_PAGE - 1 ||
                phimIndex >= 0
            ) {
                $(phimListName).html("");

                if (
                    isIncrease &&
                    phimIndex < phimList.length / NUMBER_FILM_PER_PAGE - 1
                )
                    ++phimIndex;

                if (phimIndex > 0 && !isIncrease) --phimIndex;

                renderPhim(
                    phimIndex,
                    NUMBER_FILM_PER_PAGE,
                    phimList,
                    phimListName,
                    type
                );
            }
            return phimIndex;
        }

        function deactivateControlButton(
            phimIndex,
            phimList,
            buttonClassNamePrev,
            buttonClassNameNext
        ) {
            if (phimIndex >= phimList.length / NUMBER_FILM_PER_PAGE - 1)
                $(buttonClassNameNext).addClass("deactive");
            else $(buttonClassNameNext).removeClass("deactive");

            if (phimIndex === 0) $(buttonClassNamePrev).addClass("deactive");
            else $(buttonClassNamePrev).removeClass("deactive");
        }

        $(".button-phimbo-next").click(function () {
            phimBoIndex = controlFilms(
                phimBoIndex,
                phimBo,
                ".phimBo-list",
                true,
                "phimBo"
            );
            deactivateControlButton(
                phimBoIndex,
                phimBo,
                ".button-phimbo-prev",
                ".button-phimbo-next"
            );
        });
        $(".button-phimbo-prev").click(function () {
            phimBoIndex = controlFilms(
                phimBoIndex,
                phimBo,
                ".phimBo-list",
                false,
                "phimBo"
            );
            deactivateControlButton(
                phimBoIndex,
                phimBo,
                ".button-phimbo-prev",
                ".button-phimbo-next"
            );
        });

        $(".button-phimle-next").click(function () {
            phimLeIndex = controlFilms(
                phimLeIndex,
                phimLe,
                ".phimLe-list",
                true,
                "phimLe"
            );
            deactivateControlButton(
                phimLeIndex,
                phimLe,
                ".button-phimle-prev",
                ".button-phimle-next"
            );
        });

        $(".button-phimle-prev").click(function () {
            phimLeIndex = controlFilms(
                phimLeIndex,
                phimLe,
                ".phimLe-list",
                false,
                "phimLe"
            );
            deactivateControlButton(
                phimLeIndex,
                phimLe,
                ".button-phimle-prev",
                ".button-phimle-next"
            );
        });

        $(".button-phimchieurap-next").click(function () {
            phimChieuRapIndex = controlFilms(
                phimChieuRapIndex,
                phimChieuRap,
                ".phimChieuRap-list",
                true,
                "phimChieuRap"
            );
            deactivateControlButton(
                phimChieuRapIndex,
                phimChieuRap,
                ".button-phimchieurap-prev",
                ".button-phimchieurap-next"
            );
        });
        $(".button-phimchieurap-prev").click(function () {
            phimChieuRapIndex = controlFilms(
                phimChieuRapIndex,
                phimChieuRap,
                ".phimChieuRap-list",
                false,
                "phimChieuRap"
            );
            deactivateControlButton(
                phimChieuRapIndex,
                phimChieuRap,
                ".button-phimchieurap-prev",
                ".button-phimchieurap-next"
            );
        });

        $(".button-phimhoathinh-next").click(function () {
            phimHoatHinhIndex = controlFilms(
                phimHoatHinhIndex,
                phimHoatHinh,
                ".phimHoatHinh-list",
                true,
                "phimHoatHinh"
            );
            deactivateControlButton(
                phimHoatHinhIndex,
                phimHoatHinh,
                ".button-phimhoathinh-prev",
                ".button-phimhoathinh-next"
            );
        });
        $(".button-phimhoathinh-prev").click(function () {
            phimHoatHinhIndex = controlFilms(
                phimHoatHinhIndex,
                phimHoatHinh,
                ".phimHoatHinh-list",
                false,
                "phimHoatHinh"
            );
            deactivateControlButton(
                phimHoatHinhIndex,
                phimHoatHinh,
                ".button-phimhoathinh-prev",
                ".button-phimhoathinh-next"
            );
        });
    });
});
