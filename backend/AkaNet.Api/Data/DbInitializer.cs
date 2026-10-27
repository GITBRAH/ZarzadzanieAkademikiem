using AkaNet.Api.Models;

namespace AkaNet.Api.Data;

public static class DbInitializer
{
    public static void Initialize(AkaNetDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return; // DB has been seeded
        }

        // 1. Pokoje
        var room202B = new Room
        {
            RoomNumber = "202B",
            Building = "Budynek B",
            Floor = 2,
            Capacity = 2,
            MonthlyRent = 650.00m,
            Deposit = 1000.00m
        };

        var room201A = new Room
        {
            RoomNumber = "201A",
            Building = "Budynek A",
            Floor = 2,
            Capacity = 2,
            MonthlyRent = 650.00m,
            Deposit = 1000.00m
        };

        var room305B = new Room
        {
            RoomNumber = "305B",
            Building = "Budynek B",
            Floor = 3,
            Capacity = 1,
            MonthlyRent = 850.00m,
            Deposit = 1200.00m
        };

        context.Rooms.AddRange(room202B, room201A, room305B);
        context.SaveChanges();

        // 2. Użytkownicy (Hasło domyślne: password123 / admin123)
        var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("password123");
        var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");

        var userJan = new User
        {
            Email = "jan.makara@student.pl",
            PasswordHash = defaultPasswordHash,
            FullName = "Jan Makara",
            PhoneNumber = "+48 600 123 456",
            Role = "Resident",
            RoomId = room202B.Id
        };

        var userPiotr = new User
        {
            Email = "piotr.nowak@student.pl",
            PasswordHash = defaultPasswordHash,
            FullName = "Piotr Nowak",
            PhoneNumber = "+48 501 234 567",
            Role = "Resident",
            RoomId = room202B.Id
        };

        var userAdmin = new User
        {
            Email = "admin@akanet.pl",
            PasswordHash = adminPasswordHash,
            FullName = "Administracja Akademika",
            PhoneNumber = "+48 22 555 00 00",
            Role = "Admin",
            RoomId = null
        };

        context.Users.AddRange(userJan, userPiotr, userAdmin);
        context.SaveChanges();

        // 3. Obiekty (Pralnie i Boiska)
        var facilities = new List<Facility>
        {
            // Pralnie
            new() { Type = "Laundry", Name = "Pralka 01", Location = "Pralnia · Budynek A", Status = "Active" },
            new() { Type = "Laundry", Name = "Pralka 02", Location = "Pralnia · Budynek A", Status = "Active" },
            new() { Type = "Laundry", Name = "Pralka 03", Location = "Pralnia · Budynek B", Status = "Active" },
            new() { Type = "Laundry", Name = "Pralka 04", Location = "Pralnia · Budynek B", Status = "Active" },
            new() { Type = "Laundry", Name = "Pralka 05", Location = "Pralnia · Budynek B", Status = "Active" },
            new() { Type = "Laundry", Name = "Suszarka 01", Location = "Pralnia · Budynek B", Status = "Active" },
            new() { Type = "Laundry", Name = "Pralka 06", Location = "Pralnia · Budynek C", Status = "Active" },
            // Boiska
            new() { Type = "Court", Name = "Boisko wielofunkcyjne", Location = "Centrum sportowe · Boisko 1", Status = "Active" },
            new() { Type = "Court", Name = "Boisko do piłki nożnej", Location = "Centrum sportowe · Boisko 2", Status = "Active" },
            new() { Type = "Court", Name = "Boisko do koszykówki", Location = "Centrum sportowe · Boisko 3", Status = "Active" },
        };
        context.Facilities.AddRange(facilities);
        context.SaveChanges();

        // 4. Rezerwacje początkowe (jak w prototypie Figmy)
        var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
        var tomorrow = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd");

        context.Reservations.AddRange(
            new Reservation
            {
                UserId = userJan.Id,
                FacilityId = facilities.First(f => f.Name == "Pralka 04").Id,
                Date = today,
                TimeSlot = "14:00",
                DurationMinutes = 60,
                Status = "Confirmed"
            },
            new Reservation
            {
                UserId = userJan.Id,
                FacilityId = facilities.First(f => f.Name == "Boisko wielofunkcyjne").Id,
                Date = tomorrow,
                TimeSlot = "17:00",
                DurationMinutes = 60,
                Status = "Confirmed"
            }
        );

        // 5. Ogłoszenia (jak w prototypie)
        context.Announcements.AddRange(
            new Announcement
            {
                Title = "Wieczór integracyjny mieszkańców",
                Content = "Spotkajmy się o 18:00 w sali wspólnej. Herbata, planszówki i dobra atmosfera!",
                Category = "Wydarzenia",
                Priority = "normal",
                DayBadge = "18",
                MonthBadge = "PAŹ"
            },
            new Announcement
            {
                Title = "Planowana przerwa w dostawie wody",
                Content = "W związku z pracami konserwacyjnymi dostawa wody zostanie wstrzymana od 9:00 do 11:00.",
                Category = "Awarie",
                Priority = "coral",
                DayBadge = "21",
                MonthBadge = "PAŹ"
            },
            new Announcement
            {
                Title = "Harmonogram wymiany pościeli",
                Content = "Wymiana pościeli w punkcie pralniczym odbywa się w każdy czwartek w godzinach 10:00 - 14:00.",
                Category = "Ogólne",
                Priority = "normal",
                DayBadge = "25",
                MonthBadge = "PAŹ"
            }
        );

        // 6. Usterki
        context.MaintenanceTickets.AddRange(
            new MaintenanceTicket
            {
                UserId = userJan.Id,
                Title = "Nieszczelny kran pod umywalką",
                Category = "Hydraulika",
                Description = "Krople wody zbierają się w szafce pod zlewem.",
                RoomNumber = "202B",
                Priority = "Średni",
                Status = "W trakcie",
                AdminResponse = "Konserwator został powiadomiony, wizyta zaplanowana na czwartek rano."
            },
            new MaintenanceTicket
            {
                UserId = userJan.Id,
                Title = "Uszkodzona roleta okienna",
                Category = "Meble",
                Description = "Mechanizm zwijania rolety zaciął się w pozycji opuszczonej.",
                RoomNumber = "202B",
                Priority = "Niski",
                Status = "Rozwiązane",
                AdminResponse = "Wymieniono mechanizm rolety."
            }
        );

        // 7. Podania
        context.ApplicationRequests.AddRange(
            new ApplicationRequest
            {
                UserId = userJan.Id,
                Type = "Zgłoszenie gościa",
                Title = "Nocleg gościa w weekend",
                Justification = "Zgłoszenie pobytu brata w dniach 2-3 listopada w pokoju 202B za zgodą współlokatora.",
                Status = "Zaakceptowane",
                AdminComment = "Wydano przepustkę gościnną w portierni."
            },
            new ApplicationRequest
            {
                UserId = userJan.Id,
                Type = "Wymiana mebla",
                Title = "Wymiana fotela biurowego",
                Justification = "Fotel posiada uszkodzony siłownik opuszczania.",
                Status = "Oczekujące"
            }
        );

        context.SaveChanges();
    }
}
