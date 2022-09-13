char o = 'y';
int i = 0;

if (o == 'y') {
    printf("You chose yes (y)!\n");
    i++;
} else if (o == 'n') {
    printf("You chose no (n)!\n");
    i--;
} else {
    printf("Invalid option!\n");
}

switch (o) {
    case 's':
        printf("You chose yes (y)!\n");
        break;
    case 'n':
        printf("You chose no (n)!\n");
        break;
    default:
        printf("Invalid option!\n");
}