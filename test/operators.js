// This file was generated on Mon Sep 12, 2022 23:11 (UTC-03) by REx v5.55 which is Copyright (c) 1979-2022 by Gunther Rademacher <grd@gmx.net>
// REx command line: operators.ebnf -tree -backtrack -main -javascript

function operators(string, parsingEventHandler)
{
  init(string, parsingEventHandler);

  var thisParser = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var begin = b;
    var end = e;
    var state = s;
    var offending = o;
    var expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};
    this.isAmbiguousInput = function() {return false;};

    this.getMessage = function()
    {
      return offending < 0
           ? "lexical analysis failed"
           : "syntax error";
    };
  };

  function init(source, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = source;
    size = source.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  this.getTokenOffset = function()
  {
    return b0;
  };

  this.getTokenEnd = function()
  {
    return e0;
  };

  function reset(l, b, e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    l2 = 0; b2 = 0; e2 = 0;
    l3 = 0; b3 = 0; e3 = 0;
    end = e;
    ex = -1;
    memo = {};
    eventHandler.reset(input);
  }

  this.reset = function(l, b, e)
  {
    reset(l, b, e);
  };

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? operators.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = operators.getTokenSet(- e.getState());
    }
    else
    {
      expected = [operators.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var message = e.getMessage();
    var found = this.getOffendingToken(e);
    var tokenSet = this.getExpectedTokenSet(e);
    var size = e.getEnd() - e.getBegin();
    message += (found == null ? "" : ", found " + found)
            + "\nwhile expecting "
            + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
            + "\n"
            + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ");
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    return message
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_Program = function()
  {
    eventHandler.startNonterminal("Program", e0);
    lookahead1W(14);                // END | EOF | Identifier | Null | True | False | Character | String | Real |
                                    // Comment | WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
    switch (l1)
    {
    case 2:                         // EOF
      consume(2);                   // EOF
      break;
    default:
      for (;;)
      {
        lookahead1W(11);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        if (l1 == 1)                // END
        {
          break;
        }
        whitespace();
        parse_Expression();
      }
    }
    eventHandler.endNonterminal("Program", e0);
  };

  function parse_Operation()
  {
    eventHandler.startNonterminal("Operation", e0);
    parse_VariableAssignment();
    eventHandler.endNonterminal("Operation", e0);
  }

  function try_Operation()
  {
    try_VariableAssignment();
  }

  function parse_VariableAssignment()
  {
    eventHandler.startNonterminal("VariableAssignment", e0);
    parse_ConditionalExpression();
    for (;;)
    {
      switch (l1)
      {
      case 15:                      // '%='
      case 18:                      // '&='
      case 22:                      // '*='
      case 25:                      // '+='
      case 29:                      // '-='
      case 33:                      // '/='
      case 38:                      // '<<='
      case 40:                      // '='
      case 45:                      // '>>='
      case 50:                      // '^='
      case 58:                      // '|='
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 207:                   // '%=' Identifier
        case 210:                   // '&=' Identifier
        case 214:                   // '*=' Identifier
        case 217:                   // '+=' Identifier
        case 221:                   // '-=' Identifier
        case 225:                   // '/=' Identifier
        case 230:                   // '<<=' Identifier
        case 232:                   // '=' Identifier
        case 237:                   // '>>=' Identifier
        case 242:                   // '^=' Identifier
        case 250:                   // '|=' Identifier
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 3023:                  // '%=' '['
        case 3026:                  // '&=' '['
        case 3030:                  // '*=' '['
        case 3033:                  // '+=' '['
        case 3037:                  // '-=' '['
        case 3041:                  // '/=' '['
        case 3046:                  // '<<=' '['
        case 3048:                  // '=' '['
        case 3053:                  // '>>=' '['
        case 3058:                  // '^=' '['
        case 3066:                  // '|=' '['
          lookahead3W(13);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 1231:                  // '%=' '('
        case 3599:                  // '%=' '{'
        case 1234:                  // '&=' '('
        case 3602:                  // '&=' '{'
        case 1238:                  // '*=' '('
        case 3606:                  // '*=' '{'
        case 1241:                  // '+=' '('
        case 3609:                  // '+=' '{'
        case 1245:                  // '-=' '('
        case 3613:                  // '-=' '{'
        case 1249:                  // '/=' '('
        case 3617:                  // '/=' '{'
        case 1254:                  // '<<=' '('
        case 3622:                  // '<<=' '{'
        case 1256:                  // '=' '('
        case 3624:                  // '=' '{'
        case 1261:                  // '>>=' '('
        case 3629:                  // '>>=' '{'
        case 1266:                  // '^=' '('
        case 3634:                  // '^=' '{'
        case 1274:                  // '|=' '('
        case 3642:                  // '|=' '{'
          lookahead3W(10);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 783:                   // '%=' '!'
        case 1551:                  // '%=' '++'
        case 1807:                  // '%=' '--'
        case 3919:                  // '%=' '~'
        case 786:                   // '&=' '!'
        case 1554:                  // '&=' '++'
        case 1810:                  // '&=' '--'
        case 3922:                  // '&=' '~'
        case 790:                   // '*=' '!'
        case 1558:                  // '*=' '++'
        case 1814:                  // '*=' '--'
        case 3926:                  // '*=' '~'
        case 793:                   // '+=' '!'
        case 1561:                  // '+=' '++'
        case 1817:                  // '+=' '--'
        case 3929:                  // '+=' '~'
        case 797:                   // '-=' '!'
        case 1565:                  // '-=' '++'
        case 1821:                  // '-=' '--'
        case 3933:                  // '-=' '~'
        case 801:                   // '/=' '!'
        case 1569:                  // '/=' '++'
        case 1825:                  // '/=' '--'
        case 3937:                  // '/=' '~'
        case 806:                   // '<<=' '!'
        case 1574:                  // '<<=' '++'
        case 1830:                  // '<<=' '--'
        case 3942:                  // '<<=' '~'
        case 808:                   // '=' '!'
        case 1576:                  // '=' '++'
        case 1832:                  // '=' '--'
        case 3944:                  // '=' '~'
        case 813:                   // '>>=' '!'
        case 1581:                  // '>>=' '++'
        case 1837:                  // '>>=' '--'
        case 3949:                  // '>>=' '~'
        case 818:                   // '^=' '!'
        case 1586:                  // '^=' '++'
        case 1842:                  // '^=' '--'
        case 3954:                  // '^=' '~'
        case 826:                   // '|=' '!'
        case 1594:                  // '|=' '++'
        case 1850:                  // '|=' '--'
        case 3962:                  // '|=' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 271:                   // '%=' Null
        case 335:                   // '%=' True
        case 399:                   // '%=' False
        case 463:                   // '%=' Character
        case 527:                   // '%=' String
        case 591:                   // '%=' Real
        case 274:                   // '&=' Null
        case 338:                   // '&=' True
        case 402:                   // '&=' False
        case 466:                   // '&=' Character
        case 530:                   // '&=' String
        case 594:                   // '&=' Real
        case 278:                   // '*=' Null
        case 342:                   // '*=' True
        case 406:                   // '*=' False
        case 470:                   // '*=' Character
        case 534:                   // '*=' String
        case 598:                   // '*=' Real
        case 281:                   // '+=' Null
        case 345:                   // '+=' True
        case 409:                   // '+=' False
        case 473:                   // '+=' Character
        case 537:                   // '+=' String
        case 601:                   // '+=' Real
        case 285:                   // '-=' Null
        case 349:                   // '-=' True
        case 413:                   // '-=' False
        case 477:                   // '-=' Character
        case 541:                   // '-=' String
        case 605:                   // '-=' Real
        case 289:                   // '/=' Null
        case 353:                   // '/=' True
        case 417:                   // '/=' False
        case 481:                   // '/=' Character
        case 545:                   // '/=' String
        case 609:                   // '/=' Real
        case 294:                   // '<<=' Null
        case 358:                   // '<<=' True
        case 422:                   // '<<=' False
        case 486:                   // '<<=' Character
        case 550:                   // '<<=' String
        case 614:                   // '<<=' Real
        case 296:                   // '=' Null
        case 360:                   // '=' True
        case 424:                   // '=' False
        case 488:                   // '=' Character
        case 552:                   // '=' String
        case 616:                   // '=' Real
        case 301:                   // '>>=' Null
        case 365:                   // '>>=' True
        case 429:                   // '>>=' False
        case 493:                   // '>>=' Character
        case 557:                   // '>>=' String
        case 621:                   // '>>=' Real
        case 306:                   // '^=' Null
        case 370:                   // '^=' True
        case 434:                   // '^=' False
        case 498:                   // '^=' Character
        case 562:                   // '^=' String
        case 626:                   // '^=' Real
        case 314:                   // '|=' Null
        case 378:                   // '|=' True
        case 442:                   // '|=' False
        case 506:                   // '|=' Character
        case 570:                   // '|=' String
        case 634:                   // '|=' Real
          lookahead3W(24);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk != 1                   // END
       && lk != 3                   // Identifier
       && lk != 4                   // Null
       && lk != 5                   // True
       && lk != 6                   // False
       && lk != 7                   // Character
       && lk != 8                   // String
       && lk != 9                   // Real
       && lk != 10                  // Comment
       && lk != 12                  // '!'
       && lk != 19                  // '('
       && lk != 20                  // ')'
       && lk != 24                  // '++'
       && lk != 26                  // ','
       && lk != 28                  // '--'
       && lk != 34                  // ':'
       && lk != 35                  // ';'
       && lk != 47                  // '['
       && lk != 48                  // ']'
       && lk != 51                  // 'char'
       && lk != 52                  // 'double'
       && lk != 53                  // 'float'
       && lk != 54                  // 'int'
       && lk != 55                  // 'long'
       && lk != 56                  // '{'
       && lk != 60                  // '}'
       && lk != 61)                 // '~'
      {
        lk = memoized(0, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1; var l2A = l2;
          var b2A = b2; var e2A = e2; var l3A = l3;
          var b3A = b3; var e3A = e3;
          try
          {
            switch (l1)
            {
            case 40:                // '='
              consumeT(40);         // '='
              break;
            case 22:                // '*='
              consumeT(22);         // '*='
              break;
            case 33:                // '/='
              consumeT(33);         // '/='
              break;
            case 15:                // '%='
              consumeT(15);         // '%='
              break;
            case 25:                // '+='
              consumeT(25);         // '+='
              break;
            case 29:                // '-='
              consumeT(29);         // '-='
              break;
            case 38:                // '<<='
              consumeT(38);         // '<<='
              break;
            case 45:                // '>>='
              consumeT(45);         // '>>='
              break;
            case 18:                // '&='
              consumeT(18);         // '&='
              break;
            case 50:                // '^='
              consumeT(50);         // '^='
              break;
            default:
              consumeT(58);         // '|='
            }
            lookahead1W(9);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
            try_ConditionalExpression();
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(0, e0, lk);
        }
      }
      if (lk != -1)
      {
        break;
      }
      switch (l1)
      {
      case 40:                      // '='
        consume(40);                // '='
        break;
      case 22:                      // '*='
        consume(22);                // '*='
        break;
      case 33:                      // '/='
        consume(33);                // '/='
        break;
      case 15:                      // '%='
        consume(15);                // '%='
        break;
      case 25:                      // '+='
        consume(25);                // '+='
        break;
      case 29:                      // '-='
        consume(29);                // '-='
        break;
      case 38:                      // '<<='
        consume(38);                // '<<='
        break;
      case 45:                      // '>>='
        consume(45);                // '>>='
        break;
      case 18:                      // '&='
        consume(18);                // '&='
        break;
      case 50:                      // '^='
        consume(50);                // '^='
        break;
      default:
        consume(58);                // '|='
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_ConditionalExpression();
    }
    eventHandler.endNonterminal("VariableAssignment", e0);
  }

  function try_VariableAssignment()
  {
    try_ConditionalExpression();
    for (;;)
    {
      switch (l1)
      {
      case 15:                      // '%='
      case 18:                      // '&='
      case 22:                      // '*='
      case 25:                      // '+='
      case 29:                      // '-='
      case 33:                      // '/='
      case 38:                      // '<<='
      case 40:                      // '='
      case 45:                      // '>>='
      case 50:                      // '^='
      case 58:                      // '|='
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 207:                   // '%=' Identifier
        case 210:                   // '&=' Identifier
        case 214:                   // '*=' Identifier
        case 217:                   // '+=' Identifier
        case 221:                   // '-=' Identifier
        case 225:                   // '/=' Identifier
        case 230:                   // '<<=' Identifier
        case 232:                   // '=' Identifier
        case 237:                   // '>>=' Identifier
        case 242:                   // '^=' Identifier
        case 250:                   // '|=' Identifier
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 3023:                  // '%=' '['
        case 3026:                  // '&=' '['
        case 3030:                  // '*=' '['
        case 3033:                  // '+=' '['
        case 3037:                  // '-=' '['
        case 3041:                  // '/=' '['
        case 3046:                  // '<<=' '['
        case 3048:                  // '=' '['
        case 3053:                  // '>>=' '['
        case 3058:                  // '^=' '['
        case 3066:                  // '|=' '['
          lookahead3W(13);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 1231:                  // '%=' '('
        case 3599:                  // '%=' '{'
        case 1234:                  // '&=' '('
        case 3602:                  // '&=' '{'
        case 1238:                  // '*=' '('
        case 3606:                  // '*=' '{'
        case 1241:                  // '+=' '('
        case 3609:                  // '+=' '{'
        case 1245:                  // '-=' '('
        case 3613:                  // '-=' '{'
        case 1249:                  // '/=' '('
        case 3617:                  // '/=' '{'
        case 1254:                  // '<<=' '('
        case 3622:                  // '<<=' '{'
        case 1256:                  // '=' '('
        case 3624:                  // '=' '{'
        case 1261:                  // '>>=' '('
        case 3629:                  // '>>=' '{'
        case 1266:                  // '^=' '('
        case 3634:                  // '^=' '{'
        case 1274:                  // '|=' '('
        case 3642:                  // '|=' '{'
          lookahead3W(10);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 783:                   // '%=' '!'
        case 1551:                  // '%=' '++'
        case 1807:                  // '%=' '--'
        case 3919:                  // '%=' '~'
        case 786:                   // '&=' '!'
        case 1554:                  // '&=' '++'
        case 1810:                  // '&=' '--'
        case 3922:                  // '&=' '~'
        case 790:                   // '*=' '!'
        case 1558:                  // '*=' '++'
        case 1814:                  // '*=' '--'
        case 3926:                  // '*=' '~'
        case 793:                   // '+=' '!'
        case 1561:                  // '+=' '++'
        case 1817:                  // '+=' '--'
        case 3929:                  // '+=' '~'
        case 797:                   // '-=' '!'
        case 1565:                  // '-=' '++'
        case 1821:                  // '-=' '--'
        case 3933:                  // '-=' '~'
        case 801:                   // '/=' '!'
        case 1569:                  // '/=' '++'
        case 1825:                  // '/=' '--'
        case 3937:                  // '/=' '~'
        case 806:                   // '<<=' '!'
        case 1574:                  // '<<=' '++'
        case 1830:                  // '<<=' '--'
        case 3942:                  // '<<=' '~'
        case 808:                   // '=' '!'
        case 1576:                  // '=' '++'
        case 1832:                  // '=' '--'
        case 3944:                  // '=' '~'
        case 813:                   // '>>=' '!'
        case 1581:                  // '>>=' '++'
        case 1837:                  // '>>=' '--'
        case 3949:                  // '>>=' '~'
        case 818:                   // '^=' '!'
        case 1586:                  // '^=' '++'
        case 1842:                  // '^=' '--'
        case 3954:                  // '^=' '~'
        case 826:                   // '|=' '!'
        case 1594:                  // '|=' '++'
        case 1850:                  // '|=' '--'
        case 3962:                  // '|=' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 271:                   // '%=' Null
        case 335:                   // '%=' True
        case 399:                   // '%=' False
        case 463:                   // '%=' Character
        case 527:                   // '%=' String
        case 591:                   // '%=' Real
        case 274:                   // '&=' Null
        case 338:                   // '&=' True
        case 402:                   // '&=' False
        case 466:                   // '&=' Character
        case 530:                   // '&=' String
        case 594:                   // '&=' Real
        case 278:                   // '*=' Null
        case 342:                   // '*=' True
        case 406:                   // '*=' False
        case 470:                   // '*=' Character
        case 534:                   // '*=' String
        case 598:                   // '*=' Real
        case 281:                   // '+=' Null
        case 345:                   // '+=' True
        case 409:                   // '+=' False
        case 473:                   // '+=' Character
        case 537:                   // '+=' String
        case 601:                   // '+=' Real
        case 285:                   // '-=' Null
        case 349:                   // '-=' True
        case 413:                   // '-=' False
        case 477:                   // '-=' Character
        case 541:                   // '-=' String
        case 605:                   // '-=' Real
        case 289:                   // '/=' Null
        case 353:                   // '/=' True
        case 417:                   // '/=' False
        case 481:                   // '/=' Character
        case 545:                   // '/=' String
        case 609:                   // '/=' Real
        case 294:                   // '<<=' Null
        case 358:                   // '<<=' True
        case 422:                   // '<<=' False
        case 486:                   // '<<=' Character
        case 550:                   // '<<=' String
        case 614:                   // '<<=' Real
        case 296:                   // '=' Null
        case 360:                   // '=' True
        case 424:                   // '=' False
        case 488:                   // '=' Character
        case 552:                   // '=' String
        case 616:                   // '=' Real
        case 301:                   // '>>=' Null
        case 365:                   // '>>=' True
        case 429:                   // '>>=' False
        case 493:                   // '>>=' Character
        case 557:                   // '>>=' String
        case 621:                   // '>>=' Real
        case 306:                   // '^=' Null
        case 370:                   // '^=' True
        case 434:                   // '^=' False
        case 498:                   // '^=' Character
        case 562:                   // '^=' String
        case 626:                   // '^=' Real
        case 314:                   // '|=' Null
        case 378:                   // '|=' True
        case 442:                   // '|=' False
        case 506:                   // '|=' Character
        case 570:                   // '|=' String
        case 634:                   // '|=' Real
          lookahead3W(24);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk != 1                   // END
       && lk != 3                   // Identifier
       && lk != 4                   // Null
       && lk != 5                   // True
       && lk != 6                   // False
       && lk != 7                   // Character
       && lk != 8                   // String
       && lk != 9                   // Real
       && lk != 10                  // Comment
       && lk != 12                  // '!'
       && lk != 19                  // '('
       && lk != 20                  // ')'
       && lk != 24                  // '++'
       && lk != 26                  // ','
       && lk != 28                  // '--'
       && lk != 34                  // ':'
       && lk != 35                  // ';'
       && lk != 47                  // '['
       && lk != 48                  // ']'
       && lk != 51                  // 'char'
       && lk != 52                  // 'double'
       && lk != 53                  // 'float'
       && lk != 54                  // 'int'
       && lk != 55                  // 'long'
       && lk != 56                  // '{'
       && lk != 60                  // '}'
       && lk != 61)                 // '~'
      {
        lk = memoized(0, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1; var l2A = l2;
          var b2A = b2; var e2A = e2; var l3A = l3;
          var b3A = b3; var e3A = e3;
          try
          {
            switch (l1)
            {
            case 40:                // '='
              consumeT(40);         // '='
              break;
            case 22:                // '*='
              consumeT(22);         // '*='
              break;
            case 33:                // '/='
              consumeT(33);         // '/='
              break;
            case 15:                // '%='
              consumeT(15);         // '%='
              break;
            case 25:                // '+='
              consumeT(25);         // '+='
              break;
            case 29:                // '-='
              consumeT(29);         // '-='
              break;
            case 38:                // '<<='
              consumeT(38);         // '<<='
              break;
            case 45:                // '>>='
              consumeT(45);         // '>>='
              break;
            case 18:                // '&='
              consumeT(18);         // '&='
              break;
            case 50:                // '^='
              consumeT(50);         // '^='
              break;
            default:
              consumeT(58);         // '|='
            }
            lookahead1W(9);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
            try_ConditionalExpression();
            memoize(0, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            memoize(0, e0A, -2);
            break;
          }
        }
      }
      if (lk != -1)
      {
        break;
      }
      switch (l1)
      {
      case 40:                      // '='
        consumeT(40);               // '='
        break;
      case 22:                      // '*='
        consumeT(22);               // '*='
        break;
      case 33:                      // '/='
        consumeT(33);               // '/='
        break;
      case 15:                      // '%='
        consumeT(15);               // '%='
        break;
      case 25:                      // '+='
        consumeT(25);               // '+='
        break;
      case 29:                      // '-='
        consumeT(29);               // '-='
        break;
      case 38:                      // '<<='
        consumeT(38);               // '<<='
        break;
      case 45:                      // '>>='
        consumeT(45);               // '>>='
        break;
      case 18:                      // '&='
        consumeT(18);               // '&='
        break;
      case 50:                      // '^='
        consumeT(50);               // '^='
        break;
      default:
        consumeT(58);               // '|='
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_ConditionalExpression();
    }
  }

  function parse_ConditionalExpression()
  {
    eventHandler.startNonterminal("ConditionalExpression", e0);
    parse_LogicalORExpression();
    if (l1 == 46)                   // '?'
    {
      consume(46);                  // '?'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_VariableAssignment();
      consume(34);                  // ':'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_VariableAssignment();
    }
    eventHandler.endNonterminal("ConditionalExpression", e0);
  }

  function try_ConditionalExpression()
  {
    try_LogicalORExpression();
    if (l1 == 46)                   // '?'
    {
      consumeT(46);                 // '?'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_VariableAssignment();
      consumeT(34);                 // ':'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_VariableAssignment();
    }
  }

  function parse_LogicalORExpression()
  {
    eventHandler.startNonterminal("LogicalORExpression", e0);
    parse_LogicalANDExpression();
    for (;;)
    {
      if (l1 != 59)                 // '||'
      {
        break;
      }
      consume(59);                  // '||'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_LogicalANDExpression();
    }
    eventHandler.endNonterminal("LogicalORExpression", e0);
  }

  function try_LogicalORExpression()
  {
    try_LogicalANDExpression();
    for (;;)
    {
      if (l1 != 59)                 // '||'
      {
        break;
      }
      consumeT(59);                 // '||'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_LogicalANDExpression();
    }
  }

  function parse_LogicalANDExpression()
  {
    eventHandler.startNonterminal("LogicalANDExpression", e0);
    parse_BitwiseORExpression();
    for (;;)
    {
      if (l1 != 17)                 // '&&'
      {
        break;
      }
      consume(17);                  // '&&'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_BitwiseORExpression();
    }
    eventHandler.endNonterminal("LogicalANDExpression", e0);
  }

  function try_LogicalANDExpression()
  {
    try_BitwiseORExpression();
    for (;;)
    {
      if (l1 != 17)                 // '&&'
      {
        break;
      }
      consumeT(17);                 // '&&'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_BitwiseORExpression();
    }
  }

  function parse_BitwiseORExpression()
  {
    eventHandler.startNonterminal("BitwiseORExpression", e0);
    parse_BitwiseXORExpression();
    for (;;)
    {
      if (l1 != 57)                 // '|'
      {
        break;
      }
      consume(57);                  // '|'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_BitwiseXORExpression();
    }
    eventHandler.endNonterminal("BitwiseORExpression", e0);
  }

  function try_BitwiseORExpression()
  {
    try_BitwiseXORExpression();
    for (;;)
    {
      if (l1 != 57)                 // '|'
      {
        break;
      }
      consumeT(57);                 // '|'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_BitwiseXORExpression();
    }
  }

  function parse_BitwiseXORExpression()
  {
    eventHandler.startNonterminal("BitwiseXORExpression", e0);
    parse_BitwiseANDExpression();
    for (;;)
    {
      if (l1 != 49)                 // '^'
      {
        break;
      }
      consume(49);                  // '^'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_BitwiseANDExpression();
    }
    eventHandler.endNonterminal("BitwiseXORExpression", e0);
  }

  function try_BitwiseXORExpression()
  {
    try_BitwiseANDExpression();
    for (;;)
    {
      if (l1 != 49)                 // '^'
      {
        break;
      }
      consumeT(49);                 // '^'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_BitwiseANDExpression();
    }
  }

  function parse_BitwiseANDExpression()
  {
    eventHandler.startNonterminal("BitwiseANDExpression", e0);
    parse_EqualityExpression();
    for (;;)
    {
      if (l1 != 16)                 // '&'
      {
        break;
      }
      consume(16);                  // '&'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_EqualityExpression();
    }
    eventHandler.endNonterminal("BitwiseANDExpression", e0);
  }

  function try_BitwiseANDExpression()
  {
    try_EqualityExpression();
    for (;;)
    {
      if (l1 != 16)                 // '&'
      {
        break;
      }
      consumeT(16);                 // '&'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_EqualityExpression();
    }
  }

  function parse_EqualityExpression()
  {
    eventHandler.startNonterminal("EqualityExpression", e0);
    parse_RelationalExpression();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 41)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 41:                      // '=='
        consume(41);                // '=='
        break;
      default:
        consume(13);                // '!='
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_RelationalExpression();
    }
    eventHandler.endNonterminal("EqualityExpression", e0);
  }

  function try_EqualityExpression()
  {
    try_RelationalExpression();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 41)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 41:                      // '=='
        consumeT(41);               // '=='
        break;
      default:
        consumeT(13);               // '!='
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_RelationalExpression();
    }
  }

  function parse_RelationalExpression()
  {
    eventHandler.startNonterminal("RelationalExpression", e0);
    parse_ShiftExpression();
    for (;;)
    {
      if (l1 != 36                  // '<'
       && l1 != 39                  // '<='
       && l1 != 42                  // '>'
       && l1 != 43)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 36:                      // '<'
        consume(36);                // '<'
        break;
      case 42:                      // '>'
        consume(42);                // '>'
        break;
      case 39:                      // '<='
        consume(39);                // '<='
        break;
      default:
        consume(43);                // '>='
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_ShiftExpression();
    }
    eventHandler.endNonterminal("RelationalExpression", e0);
  }

  function try_RelationalExpression()
  {
    try_ShiftExpression();
    for (;;)
    {
      if (l1 != 36                  // '<'
       && l1 != 39                  // '<='
       && l1 != 42                  // '>'
       && l1 != 43)                 // '>='
      {
        break;
      }
      switch (l1)
      {
      case 36:                      // '<'
        consumeT(36);               // '<'
        break;
      case 42:                      // '>'
        consumeT(42);               // '>'
        break;
      case 39:                      // '<='
        consumeT(39);               // '<='
        break;
      default:
        consumeT(43);               // '>='
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_ShiftExpression();
    }
  }

  function parse_ShiftExpression()
  {
    eventHandler.startNonterminal("ShiftExpression", e0);
    parse_AdditiveExpression();
    for (;;)
    {
      if (l1 != 37                  // '<<'
       && l1 != 44)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 37:                      // '<<'
        consume(37);                // '<<'
        break;
      default:
        consume(44);                // '>>'
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_AdditiveExpression();
    }
    eventHandler.endNonterminal("ShiftExpression", e0);
  }

  function try_ShiftExpression()
  {
    try_AdditiveExpression();
    for (;;)
    {
      if (l1 != 37                  // '<<'
       && l1 != 44)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 37:                      // '<<'
        consumeT(37);               // '<<'
        break;
      default:
        consumeT(44);               // '>>'
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_AdditiveExpression();
    }
  }

  function parse_AdditiveExpression()
  {
    eventHandler.startNonterminal("AdditiveExpression", e0);
    parse_MultiplicativeExpression();
    for (;;)
    {
      if (l1 != 23                  // '+'
       && l1 != 27)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 23:                      // '+'
        consume(23);                // '+'
        break;
      default:
        consume(27);                // '-'
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_MultiplicativeExpression();
    }
    eventHandler.endNonterminal("AdditiveExpression", e0);
  }

  function try_AdditiveExpression()
  {
    try_MultiplicativeExpression();
    for (;;)
    {
      if (l1 != 23                  // '+'
       && l1 != 27)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 23:                      // '+'
        consumeT(23);               // '+'
        break;
      default:
        consumeT(27);               // '-'
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_MultiplicativeExpression();
    }
  }

  function parse_MultiplicativeExpression()
  {
    eventHandler.startNonterminal("MultiplicativeExpression", e0);
    parse_PowerExpression();
    for (;;)
    {
      if (l1 != 14                  // '%'
       && l1 != 21                  // '*'
       && l1 != 32)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 21:                      // '*'
        consume(21);                // '*'
        break;
      case 32:                      // '/'
        consume(32);                // '/'
        break;
      default:
        consume(14);                // '%'
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_PowerExpression();
    }
    eventHandler.endNonterminal("MultiplicativeExpression", e0);
  }

  function try_MultiplicativeExpression()
  {
    try_PowerExpression();
    for (;;)
    {
      if (l1 != 14                  // '%'
       && l1 != 21                  // '*'
       && l1 != 32)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 21:                      // '*'
        consumeT(21);               // '*'
        break;
      case 32:                      // '/'
        consumeT(32);               // '/'
        break;
      default:
        consumeT(14);               // '%'
      }
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_PowerExpression();
    }
  }

  function parse_PowerExpression()
  {
    eventHandler.startNonterminal("PowerExpression", e0);
    parse_UnaryExpression();
    for (;;)
    {
      lookahead1W(24);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
      switch (l1)
      {
      case 49:                      // '^'
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 241:                   // '^' Identifier
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 3057:                  // '^' '['
          lookahead3W(13);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 1265:                  // '^' '('
        case 3633:                  // '^' '{'
          lookahead3W(10);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 817:                   // '^' '!'
        case 1585:                  // '^' '++'
        case 1841:                  // '^' '--'
        case 3953:                  // '^' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 305:                   // '^' Null
        case 369:                   // '^' True
        case 433:                   // '^' False
        case 497:                   // '^' Character
        case 561:                   // '^' String
        case 625:                   // '^' Real
          lookahead3W(24);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk != 1                   // END
       && lk != 3                   // Identifier
       && lk != 4                   // Null
       && lk != 5                   // True
       && lk != 6                   // False
       && lk != 7                   // Character
       && lk != 8                   // String
       && lk != 9                   // Real
       && lk != 10                  // Comment
       && lk != 12                  // '!'
       && lk != 13                  // '!='
       && lk != 14                  // '%'
       && lk != 15                  // '%='
       && lk != 16                  // '&'
       && lk != 17                  // '&&'
       && lk != 18                  // '&='
       && lk != 19                  // '('
       && lk != 20                  // ')'
       && lk != 21                  // '*'
       && lk != 22                  // '*='
       && lk != 23                  // '+'
       && lk != 24                  // '++'
       && lk != 25                  // '+='
       && lk != 26                  // ','
       && lk != 27                  // '-'
       && lk != 28                  // '--'
       && lk != 29                  // '-='
       && lk != 32                  // '/'
       && lk != 33                  // '/='
       && lk != 34                  // ':'
       && lk != 35                  // ';'
       && lk != 36                  // '<'
       && lk != 37                  // '<<'
       && lk != 38                  // '<<='
       && lk != 39                  // '<='
       && lk != 40                  // '='
       && lk != 41                  // '=='
       && lk != 42                  // '>'
       && lk != 43                  // '>='
       && lk != 44                  // '>>'
       && lk != 45                  // '>>='
       && lk != 46                  // '?'
       && lk != 47                  // '['
       && lk != 48                  // ']'
       && lk != 50                  // '^='
       && lk != 51                  // 'char'
       && lk != 52                  // 'double'
       && lk != 53                  // 'float'
       && lk != 54                  // 'int'
       && lk != 55                  // 'long'
       && lk != 56                  // '{'
       && lk != 57                  // '|'
       && lk != 58                  // '|='
       && lk != 59                  // '||'
       && lk != 60                  // '}'
       && lk != 61)                 // '~'
      {
        lk = memoized(1, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1; var l2A = l2;
          var b2A = b2; var e2A = e2; var l3A = l3;
          var b3A = b3; var e3A = e3;
          try
          {
            consumeT(49);           // '^'
            lookahead1W(9);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
            try_UnaryExpression();
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(1, e0, lk);
        }
      }
      if (lk != -1)
      {
        break;
      }
      consume(49);                  // '^'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      whitespace();
      parse_UnaryExpression();
    }
    eventHandler.endNonterminal("PowerExpression", e0);
  }

  function try_PowerExpression()
  {
    try_UnaryExpression();
    for (;;)
    {
      lookahead1W(24);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
      switch (l1)
      {
      case 49:                      // '^'
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 241:                   // '^' Identifier
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 3057:                  // '^' '['
          lookahead3W(13);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 1265:                  // '^' '('
        case 3633:                  // '^' '{'
          lookahead3W(10);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
          break;
        case 817:                   // '^' '!'
        case 1585:                  // '^' '++'
        case 1841:                  // '^' '--'
        case 3953:                  // '^' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 305:                   // '^' Null
        case 369:                   // '^' True
        case 433:                   // '^' False
        case 497:                   // '^' Character
        case 561:                   // '^' String
        case 625:                   // '^' Real
          lookahead3W(24);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk != 1                   // END
       && lk != 3                   // Identifier
       && lk != 4                   // Null
       && lk != 5                   // True
       && lk != 6                   // False
       && lk != 7                   // Character
       && lk != 8                   // String
       && lk != 9                   // Real
       && lk != 10                  // Comment
       && lk != 12                  // '!'
       && lk != 13                  // '!='
       && lk != 14                  // '%'
       && lk != 15                  // '%='
       && lk != 16                  // '&'
       && lk != 17                  // '&&'
       && lk != 18                  // '&='
       && lk != 19                  // '('
       && lk != 20                  // ')'
       && lk != 21                  // '*'
       && lk != 22                  // '*='
       && lk != 23                  // '+'
       && lk != 24                  // '++'
       && lk != 25                  // '+='
       && lk != 26                  // ','
       && lk != 27                  // '-'
       && lk != 28                  // '--'
       && lk != 29                  // '-='
       && lk != 32                  // '/'
       && lk != 33                  // '/='
       && lk != 34                  // ':'
       && lk != 35                  // ';'
       && lk != 36                  // '<'
       && lk != 37                  // '<<'
       && lk != 38                  // '<<='
       && lk != 39                  // '<='
       && lk != 40                  // '='
       && lk != 41                  // '=='
       && lk != 42                  // '>'
       && lk != 43                  // '>='
       && lk != 44                  // '>>'
       && lk != 45                  // '>>='
       && lk != 46                  // '?'
       && lk != 47                  // '['
       && lk != 48                  // ']'
       && lk != 50                  // '^='
       && lk != 51                  // 'char'
       && lk != 52                  // 'double'
       && lk != 53                  // 'float'
       && lk != 54                  // 'int'
       && lk != 55                  // 'long'
       && lk != 56                  // '{'
       && lk != 57                  // '|'
       && lk != 58                  // '|='
       && lk != 59                  // '||'
       && lk != 60                  // '}'
       && lk != 61)                 // '~'
      {
        lk = memoized(1, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1; var l2A = l2;
          var b2A = b2; var e2A = e2; var l3A = l3;
          var b3A = b3; var e3A = e3;
          try
          {
            consumeT(49);           // '^'
            lookahead1W(9);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
            try_UnaryExpression();
            memoize(1, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            memoize(1, e0A, -2);
            break;
          }
        }
      }
      if (lk != -1)
      {
        break;
      }
      consumeT(49);                 // '^'
      lookahead1W(9);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
      try_UnaryExpression();
    }
  }

  function parse_UnaryExpression()
  {
    eventHandler.startNonterminal("UnaryExpression", e0);
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 1219:                    // Identifier '('
        lookahead3W(12);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 3011:                    // Identifier '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 1539:                    // Identifier '++'
      case 1795:                    // Identifier '--'
        lookahead3W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        break;
      case 1923:                    // Identifier '->'
      case 1987:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    case 19:                        // '('
      lookahead2W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 211:                     // '(' Identifier
        lookahead3W(21);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' | '^' |
                                    // '^=' | '|' | '|=' | '||'
        break;
      case 3027:                    // '(' '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 659:                     // '(' Comment
      case 2259:                    // '(' ';'
        lookahead3W(1);             // WhiteSpace^token | ')'
        break;
      case 787:                     // '(' '!'
      case 1555:                    // '(' '++'
      case 1811:                    // '(' '--'
      case 3923:                    // '(' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 275:                     // '(' Null
      case 339:                     // '(' True
      case 403:                     // '(' False
      case 467:                     // '(' Character
      case 531:                     // '(' String
      case 595:                     // '(' Real
        lookahead3W(17);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 1235:                    // '(' '('
      case 3283:                    // '(' 'char'
      case 3347:                    // '(' 'double'
      case 3411:                    // '(' 'float'
      case 3475:                    // '(' 'int'
      case 3539:                    // '(' 'long'
      case 3603:                    // '(' '{'
        lookahead3W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    case 47:                        // '['
      lookahead2W(13);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 239:                     // '[' Identifier
        lookahead3W(23);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 687:                     // '[' Comment
        lookahead3W(7);             // WhiteSpace^token | ',' | ';' | ']'
        break;
      case 2287:                    // '[' ';'
        lookahead3W(15);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 3055:                    // '[' '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 3119:                    // '[' ']'
        lookahead3W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        break;
      case 815:                     // '[' '!'
      case 1583:                    // '[' '++'
      case 1839:                    // '[' '--'
      case 3951:                    // '[' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 303:                     // '[' Null
      case 367:                     // '[' True
      case 431:                     // '[' False
      case 495:                     // '[' Character
      case 559:                     // '[' String
      case 623:                     // '[' Real
        lookahead3W(20);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
        break;
      case 1263:                    // '[' '('
      case 3311:                    // '[' 'char'
      case 3375:                    // '[' 'double'
      case 3439:                    // '[' 'float'
      case 3503:                    // '[' 'int'
      case 3567:                    // '[' 'long'
      case 3631:                    // '[' '{'
        lookahead3W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    case 56:                        // '{'
      lookahead2W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 248:                     // '{' Identifier
        lookahead3W(22);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
        break;
      case 568:                     // '{' String
        lookahead3W(19);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
        break;
      case 3064:                    // '{' '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 696:                     // '{' Comment
      case 2296:                    // '{' ';'
        lookahead3W(5);             // WhiteSpace^token | ',' | '}'
        break;
      case 824:                     // '{' '!'
      case 1592:                    // '{' '++'
      case 1848:                    // '{' '--'
      case 3960:                    // '{' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 312:                     // '{' Null
      case 376:                     // '{' True
      case 440:                     // '{' False
      case 504:                     // '{' Character
      case 632:                     // '{' Real
        lookahead3W(18);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||' |
                                    // '}'
        break;
      case 1272:                    // '{' '('
      case 3320:                    // '{' 'char'
      case 3384:                    // '{' 'double'
      case 3448:                    // '{' 'float'
      case 3512:                    // '{' 'int'
      case 3576:                    // '{' 'long'
      case 3640:                    // '{' '{'
        lookahead3W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    case 4:                         // Null
    case 5:                         // True
    case 6:                         // False
    case 7:                         // Character
    case 8:                         // String
    case 9:                         // Real
      lookahead2W(24);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 1540:                    // Null '++'
      case 1796:                    // Null '--'
      case 1541:                    // True '++'
      case 1797:                    // True '--'
      case 1542:                    // False '++'
      case 1798:                    // False '--'
      case 1543:                    // Character '++'
      case 1799:                    // Character '--'
      case 1544:                    // String '++'
      case 1800:                    // String '--'
      case 1545:                    // Real '++'
      case 1801:                    // Real '--'
        lookahead3W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk != 12                    // '!'
     && lk != 24                    // '++'
     && lk != 28                    // '--'
     && lk != 61                    // '~'
     && lk != 67                    // Identifier END
     && lk != 68                    // Null END
     && lk != 69                    // True END
     && lk != 70                    // False END
     && lk != 71                    // Character END
     && lk != 72                    // String END
     && lk != 73                    // Real END
     && lk != 195                   // Identifier Identifier
     && lk != 196                   // Null Identifier
     && lk != 197                   // True Identifier
     && lk != 198                   // False Identifier
     && lk != 199                   // Character Identifier
     && lk != 200                   // String Identifier
     && lk != 201                   // Real Identifier
     && lk != 259                   // Identifier Null
     && lk != 260                   // Null Null
     && lk != 261                   // True Null
     && lk != 262                   // False Null
     && lk != 263                   // Character Null
     && lk != 264                   // String Null
     && lk != 265                   // Real Null
     && lk != 323                   // Identifier True
     && lk != 324                   // Null True
     && lk != 325                   // True True
     && lk != 326                   // False True
     && lk != 327                   // Character True
     && lk != 328                   // String True
     && lk != 329                   // Real True
     && lk != 387                   // Identifier False
     && lk != 388                   // Null False
     && lk != 389                   // True False
     && lk != 390                   // False False
     && lk != 391                   // Character False
     && lk != 392                   // String False
     && lk != 393                   // Real False
     && lk != 451                   // Identifier Character
     && lk != 452                   // Null Character
     && lk != 453                   // True Character
     && lk != 454                   // False Character
     && lk != 455                   // Character Character
     && lk != 456                   // String Character
     && lk != 457                   // Real Character
     && lk != 515                   // Identifier String
     && lk != 516                   // Null String
     && lk != 517                   // True String
     && lk != 518                   // False String
     && lk != 519                   // Character String
     && lk != 520                   // String String
     && lk != 521                   // Real String
     && lk != 579                   // Identifier Real
     && lk != 580                   // Null Real
     && lk != 581                   // True Real
     && lk != 582                   // False Real
     && lk != 583                   // Character Real
     && lk != 584                   // String Real
     && lk != 585                   // Real Real
     && lk != 643                   // Identifier Comment
     && lk != 644                   // Null Comment
     && lk != 645                   // True Comment
     && lk != 646                   // False Comment
     && lk != 647                   // Character Comment
     && lk != 648                   // String Comment
     && lk != 649                   // Real Comment
     && lk != 771                   // Identifier '!'
     && lk != 772                   // Null '!'
     && lk != 773                   // True '!'
     && lk != 774                   // False '!'
     && lk != 775                   // Character '!'
     && lk != 776                   // String '!'
     && lk != 777                   // Real '!'
     && lk != 835                   // Identifier '!='
     && lk != 836                   // Null '!='
     && lk != 837                   // True '!='
     && lk != 838                   // False '!='
     && lk != 839                   // Character '!='
     && lk != 840                   // String '!='
     && lk != 841                   // Real '!='
     && lk != 899                   // Identifier '%'
     && lk != 900                   // Null '%'
     && lk != 901                   // True '%'
     && lk != 902                   // False '%'
     && lk != 903                   // Character '%'
     && lk != 904                   // String '%'
     && lk != 905                   // Real '%'
     && lk != 963                   // Identifier '%='
     && lk != 964                   // Null '%='
     && lk != 965                   // True '%='
     && lk != 966                   // False '%='
     && lk != 967                   // Character '%='
     && lk != 968                   // String '%='
     && lk != 969                   // Real '%='
     && lk != 1027                  // Identifier '&'
     && lk != 1028                  // Null '&'
     && lk != 1029                  // True '&'
     && lk != 1030                  // False '&'
     && lk != 1031                  // Character '&'
     && lk != 1032                  // String '&'
     && lk != 1033                  // Real '&'
     && lk != 1091                  // Identifier '&&'
     && lk != 1092                  // Null '&&'
     && lk != 1093                  // True '&&'
     && lk != 1094                  // False '&&'
     && lk != 1095                  // Character '&&'
     && lk != 1096                  // String '&&'
     && lk != 1097                  // Real '&&'
     && lk != 1155                  // Identifier '&='
     && lk != 1156                  // Null '&='
     && lk != 1157                  // True '&='
     && lk != 1158                  // False '&='
     && lk != 1159                  // Character '&='
     && lk != 1160                  // String '&='
     && lk != 1161                  // Real '&='
     && lk != 1220                  // Null '('
     && lk != 1221                  // True '('
     && lk != 1222                  // False '('
     && lk != 1223                  // Character '('
     && lk != 1224                  // String '('
     && lk != 1225                  // Real '('
     && lk != 1283                  // Identifier ')'
     && lk != 1284                  // Null ')'
     && lk != 1285                  // True ')'
     && lk != 1286                  // False ')'
     && lk != 1287                  // Character ')'
     && lk != 1288                  // String ')'
     && lk != 1289                  // Real ')'
     && lk != 1347                  // Identifier '*'
     && lk != 1348                  // Null '*'
     && lk != 1349                  // True '*'
     && lk != 1350                  // False '*'
     && lk != 1351                  // Character '*'
     && lk != 1352                  // String '*'
     && lk != 1353                  // Real '*'
     && lk != 1411                  // Identifier '*='
     && lk != 1412                  // Null '*='
     && lk != 1413                  // True '*='
     && lk != 1414                  // False '*='
     && lk != 1415                  // Character '*='
     && lk != 1416                  // String '*='
     && lk != 1417                  // Real '*='
     && lk != 1475                  // Identifier '+'
     && lk != 1476                  // Null '+'
     && lk != 1477                  // True '+'
     && lk != 1478                  // False '+'
     && lk != 1479                  // Character '+'
     && lk != 1480                  // String '+'
     && lk != 1481                  // Real '+'
     && lk != 1603                  // Identifier '+='
     && lk != 1604                  // Null '+='
     && lk != 1605                  // True '+='
     && lk != 1606                  // False '+='
     && lk != 1607                  // Character '+='
     && lk != 1608                  // String '+='
     && lk != 1609                  // Real '+='
     && lk != 1667                  // Identifier ','
     && lk != 1668                  // Null ','
     && lk != 1669                  // True ','
     && lk != 1670                  // False ','
     && lk != 1671                  // Character ','
     && lk != 1672                  // String ','
     && lk != 1673                  // Real ','
     && lk != 1731                  // Identifier '-'
     && lk != 1732                  // Null '-'
     && lk != 1733                  // True '-'
     && lk != 1734                  // False '-'
     && lk != 1735                  // Character '-'
     && lk != 1736                  // String '-'
     && lk != 1737                  // Real '-'
     && lk != 1859                  // Identifier '-='
     && lk != 1860                  // Null '-='
     && lk != 1861                  // True '-='
     && lk != 1862                  // False '-='
     && lk != 1863                  // Character '-='
     && lk != 1864                  // String '-='
     && lk != 1865                  // Real '-='
     && lk != 2051                  // Identifier '/'
     && lk != 2052                  // Null '/'
     && lk != 2053                  // True '/'
     && lk != 2054                  // False '/'
     && lk != 2055                  // Character '/'
     && lk != 2056                  // String '/'
     && lk != 2057                  // Real '/'
     && lk != 2115                  // Identifier '/='
     && lk != 2116                  // Null '/='
     && lk != 2117                  // True '/='
     && lk != 2118                  // False '/='
     && lk != 2119                  // Character '/='
     && lk != 2120                  // String '/='
     && lk != 2121                  // Real '/='
     && lk != 2179                  // Identifier ':'
     && lk != 2180                  // Null ':'
     && lk != 2181                  // True ':'
     && lk != 2182                  // False ':'
     && lk != 2183                  // Character ':'
     && lk != 2184                  // String ':'
     && lk != 2185                  // Real ':'
     && lk != 2243                  // Identifier ';'
     && lk != 2244                  // Null ';'
     && lk != 2245                  // True ';'
     && lk != 2246                  // False ';'
     && lk != 2247                  // Character ';'
     && lk != 2248                  // String ';'
     && lk != 2249                  // Real ';'
     && lk != 2307                  // Identifier '<'
     && lk != 2308                  // Null '<'
     && lk != 2309                  // True '<'
     && lk != 2310                  // False '<'
     && lk != 2311                  // Character '<'
     && lk != 2312                  // String '<'
     && lk != 2313                  // Real '<'
     && lk != 2371                  // Identifier '<<'
     && lk != 2372                  // Null '<<'
     && lk != 2373                  // True '<<'
     && lk != 2374                  // False '<<'
     && lk != 2375                  // Character '<<'
     && lk != 2376                  // String '<<'
     && lk != 2377                  // Real '<<'
     && lk != 2435                  // Identifier '<<='
     && lk != 2436                  // Null '<<='
     && lk != 2437                  // True '<<='
     && lk != 2438                  // False '<<='
     && lk != 2439                  // Character '<<='
     && lk != 2440                  // String '<<='
     && lk != 2441                  // Real '<<='
     && lk != 2499                  // Identifier '<='
     && lk != 2500                  // Null '<='
     && lk != 2501                  // True '<='
     && lk != 2502                  // False '<='
     && lk != 2503                  // Character '<='
     && lk != 2504                  // String '<='
     && lk != 2505                  // Real '<='
     && lk != 2563                  // Identifier '='
     && lk != 2564                  // Null '='
     && lk != 2565                  // True '='
     && lk != 2566                  // False '='
     && lk != 2567                  // Character '='
     && lk != 2568                  // String '='
     && lk != 2569                  // Real '='
     && lk != 2627                  // Identifier '=='
     && lk != 2628                  // Null '=='
     && lk != 2629                  // True '=='
     && lk != 2630                  // False '=='
     && lk != 2631                  // Character '=='
     && lk != 2632                  // String '=='
     && lk != 2633                  // Real '=='
     && lk != 2691                  // Identifier '>'
     && lk != 2692                  // Null '>'
     && lk != 2693                  // True '>'
     && lk != 2694                  // False '>'
     && lk != 2695                  // Character '>'
     && lk != 2696                  // String '>'
     && lk != 2697                  // Real '>'
     && lk != 2755                  // Identifier '>='
     && lk != 2756                  // Null '>='
     && lk != 2757                  // True '>='
     && lk != 2758                  // False '>='
     && lk != 2759                  // Character '>='
     && lk != 2760                  // String '>='
     && lk != 2761                  // Real '>='
     && lk != 2819                  // Identifier '>>'
     && lk != 2820                  // Null '>>'
     && lk != 2821                  // True '>>'
     && lk != 2822                  // False '>>'
     && lk != 2823                  // Character '>>'
     && lk != 2824                  // String '>>'
     && lk != 2825                  // Real '>>'
     && lk != 2883                  // Identifier '>>='
     && lk != 2884                  // Null '>>='
     && lk != 2885                  // True '>>='
     && lk != 2886                  // False '>>='
     && lk != 2887                  // Character '>>='
     && lk != 2888                  // String '>>='
     && lk != 2889                  // Real '>>='
     && lk != 2947                  // Identifier '?'
     && lk != 2948                  // Null '?'
     && lk != 2949                  // True '?'
     && lk != 2950                  // False '?'
     && lk != 2951                  // Character '?'
     && lk != 2952                  // String '?'
     && lk != 2953                  // Real '?'
     && lk != 3012                  // Null '['
     && lk != 3013                  // True '['
     && lk != 3014                  // False '['
     && lk != 3015                  // Character '['
     && lk != 3016                  // String '['
     && lk != 3017                  // Real '['
     && lk != 3075                  // Identifier ']'
     && lk != 3076                  // Null ']'
     && lk != 3077                  // True ']'
     && lk != 3078                  // False ']'
     && lk != 3079                  // Character ']'
     && lk != 3080                  // String ']'
     && lk != 3081                  // Real ']'
     && lk != 3139                  // Identifier '^'
     && lk != 3140                  // Null '^'
     && lk != 3141                  // True '^'
     && lk != 3142                  // False '^'
     && lk != 3143                  // Character '^'
     && lk != 3144                  // String '^'
     && lk != 3145                  // Real '^'
     && lk != 3203                  // Identifier '^='
     && lk != 3204                  // Null '^='
     && lk != 3205                  // True '^='
     && lk != 3206                  // False '^='
     && lk != 3207                  // Character '^='
     && lk != 3208                  // String '^='
     && lk != 3209                  // Real '^='
     && lk != 3267                  // Identifier 'char'
     && lk != 3268                  // Null 'char'
     && lk != 3269                  // True 'char'
     && lk != 3270                  // False 'char'
     && lk != 3271                  // Character 'char'
     && lk != 3272                  // String 'char'
     && lk != 3273                  // Real 'char'
     && lk != 3331                  // Identifier 'double'
     && lk != 3332                  // Null 'double'
     && lk != 3333                  // True 'double'
     && lk != 3334                  // False 'double'
     && lk != 3335                  // Character 'double'
     && lk != 3336                  // String 'double'
     && lk != 3337                  // Real 'double'
     && lk != 3395                  // Identifier 'float'
     && lk != 3396                  // Null 'float'
     && lk != 3397                  // True 'float'
     && lk != 3398                  // False 'float'
     && lk != 3399                  // Character 'float'
     && lk != 3400                  // String 'float'
     && lk != 3401                  // Real 'float'
     && lk != 3459                  // Identifier 'int'
     && lk != 3460                  // Null 'int'
     && lk != 3461                  // True 'int'
     && lk != 3462                  // False 'int'
     && lk != 3463                  // Character 'int'
     && lk != 3464                  // String 'int'
     && lk != 3465                  // Real 'int'
     && lk != 3523                  // Identifier 'long'
     && lk != 3524                  // Null 'long'
     && lk != 3525                  // True 'long'
     && lk != 3526                  // False 'long'
     && lk != 3527                  // Character 'long'
     && lk != 3528                  // String 'long'
     && lk != 3529                  // Real 'long'
     && lk != 3587                  // Identifier '{'
     && lk != 3588                  // Null '{'
     && lk != 3589                  // True '{'
     && lk != 3590                  // False '{'
     && lk != 3591                  // Character '{'
     && lk != 3592                  // String '{'
     && lk != 3593                  // Real '{'
     && lk != 3651                  // Identifier '|'
     && lk != 3652                  // Null '|'
     && lk != 3653                  // True '|'
     && lk != 3654                  // False '|'
     && lk != 3655                  // Character '|'
     && lk != 3656                  // String '|'
     && lk != 3657                  // Real '|'
     && lk != 3715                  // Identifier '|='
     && lk != 3716                  // Null '|='
     && lk != 3717                  // True '|='
     && lk != 3718                  // False '|='
     && lk != 3719                  // Character '|='
     && lk != 3720                  // String '|='
     && lk != 3721                  // Real '|='
     && lk != 3779                  // Identifier '||'
     && lk != 3780                  // Null '||'
     && lk != 3781                  // True '||'
     && lk != 3782                  // False '||'
     && lk != 3783                  // Character '||'
     && lk != 3784                  // String '||'
     && lk != 3785                  // Real '||'
     && lk != 3843                  // Identifier '}'
     && lk != 3844                  // Null '}'
     && lk != 3845                  // True '}'
     && lk != 3846                  // False '}'
     && lk != 3847                  // Character '}'
     && lk != 3848                  // String '}'
     && lk != 3849                  // Real '}'
     && lk != 3907                  // Identifier '~'
     && lk != 3908                  // Null '~'
     && lk != 3909                  // True '~'
     && lk != 3910                  // False '~'
     && lk != 3911                  // Character '~'
     && lk != 3912                  // String '~'
     && lk != 3913                  // Real '~'
     && lk != 5635                  // Identifier '++' END
     && lk != 5636                  // Null '++' END
     && lk != 5637                  // True '++' END
     && lk != 5638                  // False '++' END
     && lk != 5639                  // Character '++' END
     && lk != 5640                  // String '++' END
     && lk != 5641                  // Real '++' END
     && lk != 5891                  // Identifier '--' END
     && lk != 5892                  // Null '--' END
     && lk != 5893                  // True '--' END
     && lk != 5894                  // False '--' END
     && lk != 5895                  // Character '--' END
     && lk != 5896                  // String '--' END
     && lk != 5897                  // Real '--' END
     && lk != 7215                  // '[' ']' END
     && lk != 15407                 // '[' ']' Identifier
     && lk != 19503                 // '[' ']' Null
     && lk != 23599                 // '[' ']' True
     && lk != 27695                 // '[' ']' False
     && lk != 31791                 // '[' ']' Character
     && lk != 35887                 // '[' ']' String
     && lk != 39983                 // '[' ']' Real
     && lk != 42499                 // Identifier '++' Comment
     && lk != 42500                 // Null '++' Comment
     && lk != 42501                 // True '++' Comment
     && lk != 42502                 // False '++' Comment
     && lk != 42503                 // Character '++' Comment
     && lk != 42504                 // String '++' Comment
     && lk != 42505                 // Real '++' Comment
     && lk != 42755                 // Identifier '--' Comment
     && lk != 42756                 // Null '--' Comment
     && lk != 42757                 // True '--' Comment
     && lk != 42758                 // False '--' Comment
     && lk != 42759                 // Character '--' Comment
     && lk != 42760                 // String '--' Comment
     && lk != 42761                 // Real '--' Comment
     && lk != 44079                 // '[' ']' Comment
     && lk != 50691                 // Identifier '++' '!'
     && lk != 50692                 // Null '++' '!'
     && lk != 50693                 // True '++' '!'
     && lk != 50694                 // False '++' '!'
     && lk != 50695                 // Character '++' '!'
     && lk != 50696                 // String '++' '!'
     && lk != 50697                 // Real '++' '!'
     && lk != 50947                 // Identifier '--' '!'
     && lk != 50948                 // Null '--' '!'
     && lk != 50949                 // True '--' '!'
     && lk != 50950                 // False '--' '!'
     && lk != 50951                 // Character '--' '!'
     && lk != 50952                 // String '--' '!'
     && lk != 50953                 // Real '--' '!'
     && lk != 52271                 // '[' ']' '!'
     && lk != 54787                 // Identifier '++' '!='
     && lk != 54788                 // Null '++' '!='
     && lk != 54789                 // True '++' '!='
     && lk != 54790                 // False '++' '!='
     && lk != 54791                 // Character '++' '!='
     && lk != 54792                 // String '++' '!='
     && lk != 54793                 // Real '++' '!='
     && lk != 55043                 // Identifier '--' '!='
     && lk != 55044                 // Null '--' '!='
     && lk != 55045                 // True '--' '!='
     && lk != 55046                 // False '--' '!='
     && lk != 55047                 // Character '--' '!='
     && lk != 55048                 // String '--' '!='
     && lk != 55049                 // Real '--' '!='
     && lk != 56367                 // '[' ']' '!='
     && lk != 58883                 // Identifier '++' '%'
     && lk != 58884                 // Null '++' '%'
     && lk != 58885                 // True '++' '%'
     && lk != 58886                 // False '++' '%'
     && lk != 58887                 // Character '++' '%'
     && lk != 58888                 // String '++' '%'
     && lk != 58889                 // Real '++' '%'
     && lk != 59139                 // Identifier '--' '%'
     && lk != 59140                 // Null '--' '%'
     && lk != 59141                 // True '--' '%'
     && lk != 59142                 // False '--' '%'
     && lk != 59143                 // Character '--' '%'
     && lk != 59144                 // String '--' '%'
     && lk != 59145                 // Real '--' '%'
     && lk != 60463                 // '[' ']' '%'
     && lk != 62979                 // Identifier '++' '%='
     && lk != 62980                 // Null '++' '%='
     && lk != 62981                 // True '++' '%='
     && lk != 62982                 // False '++' '%='
     && lk != 62983                 // Character '++' '%='
     && lk != 62984                 // String '++' '%='
     && lk != 62985                 // Real '++' '%='
     && lk != 63235                 // Identifier '--' '%='
     && lk != 63236                 // Null '--' '%='
     && lk != 63237                 // True '--' '%='
     && lk != 63238                 // False '--' '%='
     && lk != 63239                 // Character '--' '%='
     && lk != 63240                 // String '--' '%='
     && lk != 63241                 // Real '--' '%='
     && lk != 64559                 // '[' ']' '%='
     && lk != 67075                 // Identifier '++' '&'
     && lk != 67076                 // Null '++' '&'
     && lk != 67077                 // True '++' '&'
     && lk != 67078                 // False '++' '&'
     && lk != 67079                 // Character '++' '&'
     && lk != 67080                 // String '++' '&'
     && lk != 67081                 // Real '++' '&'
     && lk != 67331                 // Identifier '--' '&'
     && lk != 67332                 // Null '--' '&'
     && lk != 67333                 // True '--' '&'
     && lk != 67334                 // False '--' '&'
     && lk != 67335                 // Character '--' '&'
     && lk != 67336                 // String '--' '&'
     && lk != 67337                 // Real '--' '&'
     && lk != 68655                 // '[' ']' '&'
     && lk != 71171                 // Identifier '++' '&&'
     && lk != 71172                 // Null '++' '&&'
     && lk != 71173                 // True '++' '&&'
     && lk != 71174                 // False '++' '&&'
     && lk != 71175                 // Character '++' '&&'
     && lk != 71176                 // String '++' '&&'
     && lk != 71177                 // Real '++' '&&'
     && lk != 71427                 // Identifier '--' '&&'
     && lk != 71428                 // Null '--' '&&'
     && lk != 71429                 // True '--' '&&'
     && lk != 71430                 // False '--' '&&'
     && lk != 71431                 // Character '--' '&&'
     && lk != 71432                 // String '--' '&&'
     && lk != 71433                 // Real '--' '&&'
     && lk != 72751                 // '[' ']' '&&'
     && lk != 75267                 // Identifier '++' '&='
     && lk != 75268                 // Null '++' '&='
     && lk != 75269                 // True '++' '&='
     && lk != 75270                 // False '++' '&='
     && lk != 75271                 // Character '++' '&='
     && lk != 75272                 // String '++' '&='
     && lk != 75273                 // Real '++' '&='
     && lk != 75523                 // Identifier '--' '&='
     && lk != 75524                 // Null '--' '&='
     && lk != 75525                 // True '--' '&='
     && lk != 75526                 // False '--' '&='
     && lk != 75527                 // Character '--' '&='
     && lk != 75528                 // String '--' '&='
     && lk != 75529                 // Real '--' '&='
     && lk != 76847                 // '[' ']' '&='
     && lk != 80943                 // '[' ']' '('
     && lk != 83459                 // Identifier '++' ')'
     && lk != 83460                 // Null '++' ')'
     && lk != 83461                 // True '++' ')'
     && lk != 83462                 // False '++' ')'
     && lk != 83463                 // Character '++' ')'
     && lk != 83464                 // String '++' ')'
     && lk != 83465                 // Real '++' ')'
     && lk != 83715                 // Identifier '--' ')'
     && lk != 83716                 // Null '--' ')'
     && lk != 83717                 // True '--' ')'
     && lk != 83718                 // False '--' ')'
     && lk != 83719                 // Character '--' ')'
     && lk != 83720                 // String '--' ')'
     && lk != 83721                 // Real '--' ')'
     && lk != 85039                 // '[' ']' ')'
     && lk != 87555                 // Identifier '++' '*'
     && lk != 87556                 // Null '++' '*'
     && lk != 87557                 // True '++' '*'
     && lk != 87558                 // False '++' '*'
     && lk != 87559                 // Character '++' '*'
     && lk != 87560                 // String '++' '*'
     && lk != 87561                 // Real '++' '*'
     && lk != 87811                 // Identifier '--' '*'
     && lk != 87812                 // Null '--' '*'
     && lk != 87813                 // True '--' '*'
     && lk != 87814                 // False '--' '*'
     && lk != 87815                 // Character '--' '*'
     && lk != 87816                 // String '--' '*'
     && lk != 87817                 // Real '--' '*'
     && lk != 89135                 // '[' ']' '*'
     && lk != 91651                 // Identifier '++' '*='
     && lk != 91652                 // Null '++' '*='
     && lk != 91653                 // True '++' '*='
     && lk != 91654                 // False '++' '*='
     && lk != 91655                 // Character '++' '*='
     && lk != 91656                 // String '++' '*='
     && lk != 91657                 // Real '++' '*='
     && lk != 91907                 // Identifier '--' '*='
     && lk != 91908                 // Null '--' '*='
     && lk != 91909                 // True '--' '*='
     && lk != 91910                 // False '--' '*='
     && lk != 91911                 // Character '--' '*='
     && lk != 91912                 // String '--' '*='
     && lk != 91913                 // Real '--' '*='
     && lk != 93231                 // '[' ']' '*='
     && lk != 95747                 // Identifier '++' '+'
     && lk != 95748                 // Null '++' '+'
     && lk != 95749                 // True '++' '+'
     && lk != 95750                 // False '++' '+'
     && lk != 95751                 // Character '++' '+'
     && lk != 95752                 // String '++' '+'
     && lk != 95753                 // Real '++' '+'
     && lk != 96003                 // Identifier '--' '+'
     && lk != 96004                 // Null '--' '+'
     && lk != 96005                 // True '--' '+'
     && lk != 96006                 // False '--' '+'
     && lk != 96007                 // Character '--' '+'
     && lk != 96008                 // String '--' '+'
     && lk != 96009                 // Real '--' '+'
     && lk != 97327                 // '[' ']' '+'
     && lk != 99843                 // Identifier '++' '++'
     && lk != 99844                 // Null '++' '++'
     && lk != 99845                 // True '++' '++'
     && lk != 99846                 // False '++' '++'
     && lk != 99847                 // Character '++' '++'
     && lk != 99848                 // String '++' '++'
     && lk != 99849                 // Real '++' '++'
     && lk != 100099                // Identifier '--' '++'
     && lk != 100100                // Null '--' '++'
     && lk != 100101                // True '--' '++'
     && lk != 100102                // False '--' '++'
     && lk != 100103                // Character '--' '++'
     && lk != 100104                // String '--' '++'
     && lk != 100105                // Real '--' '++'
     && lk != 103939                // Identifier '++' '+='
     && lk != 103940                // Null '++' '+='
     && lk != 103941                // True '++' '+='
     && lk != 103942                // False '++' '+='
     && lk != 103943                // Character '++' '+='
     && lk != 103944                // String '++' '+='
     && lk != 103945                // Real '++' '+='
     && lk != 104195                // Identifier '--' '+='
     && lk != 104196                // Null '--' '+='
     && lk != 104197                // True '--' '+='
     && lk != 104198                // False '--' '+='
     && lk != 104199                // Character '--' '+='
     && lk != 104200                // String '--' '+='
     && lk != 104201                // Real '--' '+='
     && lk != 105519                // '[' ']' '+='
     && lk != 108035                // Identifier '++' ','
     && lk != 108036                // Null '++' ','
     && lk != 108037                // True '++' ','
     && lk != 108038                // False '++' ','
     && lk != 108039                // Character '++' ','
     && lk != 108040                // String '++' ','
     && lk != 108041                // Real '++' ','
     && lk != 108291                // Identifier '--' ','
     && lk != 108292                // Null '--' ','
     && lk != 108293                // True '--' ','
     && lk != 108294                // False '--' ','
     && lk != 108295                // Character '--' ','
     && lk != 108296                // String '--' ','
     && lk != 108297                // Real '--' ','
     && lk != 109615                // '[' ']' ','
     && lk != 112131                // Identifier '++' '-'
     && lk != 112132                // Null '++' '-'
     && lk != 112133                // True '++' '-'
     && lk != 112134                // False '++' '-'
     && lk != 112135                // Character '++' '-'
     && lk != 112136                // String '++' '-'
     && lk != 112137                // Real '++' '-'
     && lk != 112387                // Identifier '--' '-'
     && lk != 112388                // Null '--' '-'
     && lk != 112389                // True '--' '-'
     && lk != 112390                // False '--' '-'
     && lk != 112391                // Character '--' '-'
     && lk != 112392                // String '--' '-'
     && lk != 112393                // Real '--' '-'
     && lk != 113711                // '[' ']' '-'
     && lk != 116227                // Identifier '++' '--'
     && lk != 116228                // Null '++' '--'
     && lk != 116229                // True '++' '--'
     && lk != 116230                // False '++' '--'
     && lk != 116231                // Character '++' '--'
     && lk != 116232                // String '++' '--'
     && lk != 116233                // Real '++' '--'
     && lk != 116483                // Identifier '--' '--'
     && lk != 116484                // Null '--' '--'
     && lk != 116485                // True '--' '--'
     && lk != 116486                // False '--' '--'
     && lk != 116487                // Character '--' '--'
     && lk != 116488                // String '--' '--'
     && lk != 116489                // Real '--' '--'
     && lk != 120323                // Identifier '++' '-='
     && lk != 120324                // Null '++' '-='
     && lk != 120325                // True '++' '-='
     && lk != 120326                // False '++' '-='
     && lk != 120327                // Character '++' '-='
     && lk != 120328                // String '++' '-='
     && lk != 120329                // Real '++' '-='
     && lk != 120579                // Identifier '--' '-='
     && lk != 120580                // Null '--' '-='
     && lk != 120581                // True '--' '-='
     && lk != 120582                // False '--' '-='
     && lk != 120583                // Character '--' '-='
     && lk != 120584                // String '--' '-='
     && lk != 120585                // Real '--' '-='
     && lk != 121903                // '[' ']' '-='
     && lk != 132611                // Identifier '++' '/'
     && lk != 132612                // Null '++' '/'
     && lk != 132613                // True '++' '/'
     && lk != 132614                // False '++' '/'
     && lk != 132615                // Character '++' '/'
     && lk != 132616                // String '++' '/'
     && lk != 132617                // Real '++' '/'
     && lk != 132867                // Identifier '--' '/'
     && lk != 132868                // Null '--' '/'
     && lk != 132869                // True '--' '/'
     && lk != 132870                // False '--' '/'
     && lk != 132871                // Character '--' '/'
     && lk != 132872                // String '--' '/'
     && lk != 132873                // Real '--' '/'
     && lk != 134191                // '[' ']' '/'
     && lk != 136707                // Identifier '++' '/='
     && lk != 136708                // Null '++' '/='
     && lk != 136709                // True '++' '/='
     && lk != 136710                // False '++' '/='
     && lk != 136711                // Character '++' '/='
     && lk != 136712                // String '++' '/='
     && lk != 136713                // Real '++' '/='
     && lk != 136963                // Identifier '--' '/='
     && lk != 136964                // Null '--' '/='
     && lk != 136965                // True '--' '/='
     && lk != 136966                // False '--' '/='
     && lk != 136967                // Character '--' '/='
     && lk != 136968                // String '--' '/='
     && lk != 136969                // Real '--' '/='
     && lk != 138287                // '[' ']' '/='
     && lk != 140803                // Identifier '++' ':'
     && lk != 140804                // Null '++' ':'
     && lk != 140805                // True '++' ':'
     && lk != 140806                // False '++' ':'
     && lk != 140807                // Character '++' ':'
     && lk != 140808                // String '++' ':'
     && lk != 140809                // Real '++' ':'
     && lk != 141059                // Identifier '--' ':'
     && lk != 141060                // Null '--' ':'
     && lk != 141061                // True '--' ':'
     && lk != 141062                // False '--' ':'
     && lk != 141063                // Character '--' ':'
     && lk != 141064                // String '--' ':'
     && lk != 141065                // Real '--' ':'
     && lk != 142383                // '[' ']' ':'
     && lk != 144899                // Identifier '++' ';'
     && lk != 144900                // Null '++' ';'
     && lk != 144901                // True '++' ';'
     && lk != 144902                // False '++' ';'
     && lk != 144903                // Character '++' ';'
     && lk != 144904                // String '++' ';'
     && lk != 144905                // Real '++' ';'
     && lk != 145155                // Identifier '--' ';'
     && lk != 145156                // Null '--' ';'
     && lk != 145157                // True '--' ';'
     && lk != 145158                // False '--' ';'
     && lk != 145159                // Character '--' ';'
     && lk != 145160                // String '--' ';'
     && lk != 145161                // Real '--' ';'
     && lk != 146479                // '[' ']' ';'
     && lk != 148995                // Identifier '++' '<'
     && lk != 148996                // Null '++' '<'
     && lk != 148997                // True '++' '<'
     && lk != 148998                // False '++' '<'
     && lk != 148999                // Character '++' '<'
     && lk != 149000                // String '++' '<'
     && lk != 149001                // Real '++' '<'
     && lk != 149251                // Identifier '--' '<'
     && lk != 149252                // Null '--' '<'
     && lk != 149253                // True '--' '<'
     && lk != 149254                // False '--' '<'
     && lk != 149255                // Character '--' '<'
     && lk != 149256                // String '--' '<'
     && lk != 149257                // Real '--' '<'
     && lk != 150575                // '[' ']' '<'
     && lk != 153091                // Identifier '++' '<<'
     && lk != 153092                // Null '++' '<<'
     && lk != 153093                // True '++' '<<'
     && lk != 153094                // False '++' '<<'
     && lk != 153095                // Character '++' '<<'
     && lk != 153096                // String '++' '<<'
     && lk != 153097                // Real '++' '<<'
     && lk != 153347                // Identifier '--' '<<'
     && lk != 153348                // Null '--' '<<'
     && lk != 153349                // True '--' '<<'
     && lk != 153350                // False '--' '<<'
     && lk != 153351                // Character '--' '<<'
     && lk != 153352                // String '--' '<<'
     && lk != 153353                // Real '--' '<<'
     && lk != 154671                // '[' ']' '<<'
     && lk != 157187                // Identifier '++' '<<='
     && lk != 157188                // Null '++' '<<='
     && lk != 157189                // True '++' '<<='
     && lk != 157190                // False '++' '<<='
     && lk != 157191                // Character '++' '<<='
     && lk != 157192                // String '++' '<<='
     && lk != 157193                // Real '++' '<<='
     && lk != 157443                // Identifier '--' '<<='
     && lk != 157444                // Null '--' '<<='
     && lk != 157445                // True '--' '<<='
     && lk != 157446                // False '--' '<<='
     && lk != 157447                // Character '--' '<<='
     && lk != 157448                // String '--' '<<='
     && lk != 157449                // Real '--' '<<='
     && lk != 158767                // '[' ']' '<<='
     && lk != 161283                // Identifier '++' '<='
     && lk != 161284                // Null '++' '<='
     && lk != 161285                // True '++' '<='
     && lk != 161286                // False '++' '<='
     && lk != 161287                // Character '++' '<='
     && lk != 161288                // String '++' '<='
     && lk != 161289                // Real '++' '<='
     && lk != 161539                // Identifier '--' '<='
     && lk != 161540                // Null '--' '<='
     && lk != 161541                // True '--' '<='
     && lk != 161542                // False '--' '<='
     && lk != 161543                // Character '--' '<='
     && lk != 161544                // String '--' '<='
     && lk != 161545                // Real '--' '<='
     && lk != 162863                // '[' ']' '<='
     && lk != 165379                // Identifier '++' '='
     && lk != 165380                // Null '++' '='
     && lk != 165381                // True '++' '='
     && lk != 165382                // False '++' '='
     && lk != 165383                // Character '++' '='
     && lk != 165384                // String '++' '='
     && lk != 165385                // Real '++' '='
     && lk != 165635                // Identifier '--' '='
     && lk != 165636                // Null '--' '='
     && lk != 165637                // True '--' '='
     && lk != 165638                // False '--' '='
     && lk != 165639                // Character '--' '='
     && lk != 165640                // String '--' '='
     && lk != 165641                // Real '--' '='
     && lk != 166959                // '[' ']' '='
     && lk != 169475                // Identifier '++' '=='
     && lk != 169476                // Null '++' '=='
     && lk != 169477                // True '++' '=='
     && lk != 169478                // False '++' '=='
     && lk != 169479                // Character '++' '=='
     && lk != 169480                // String '++' '=='
     && lk != 169481                // Real '++' '=='
     && lk != 169731                // Identifier '--' '=='
     && lk != 169732                // Null '--' '=='
     && lk != 169733                // True '--' '=='
     && lk != 169734                // False '--' '=='
     && lk != 169735                // Character '--' '=='
     && lk != 169736                // String '--' '=='
     && lk != 169737                // Real '--' '=='
     && lk != 171055                // '[' ']' '=='
     && lk != 173571                // Identifier '++' '>'
     && lk != 173572                // Null '++' '>'
     && lk != 173573                // True '++' '>'
     && lk != 173574                // False '++' '>'
     && lk != 173575                // Character '++' '>'
     && lk != 173576                // String '++' '>'
     && lk != 173577                // Real '++' '>'
     && lk != 173827                // Identifier '--' '>'
     && lk != 173828                // Null '--' '>'
     && lk != 173829                // True '--' '>'
     && lk != 173830                // False '--' '>'
     && lk != 173831                // Character '--' '>'
     && lk != 173832                // String '--' '>'
     && lk != 173833                // Real '--' '>'
     && lk != 175151                // '[' ']' '>'
     && lk != 177667                // Identifier '++' '>='
     && lk != 177668                // Null '++' '>='
     && lk != 177669                // True '++' '>='
     && lk != 177670                // False '++' '>='
     && lk != 177671                // Character '++' '>='
     && lk != 177672                // String '++' '>='
     && lk != 177673                // Real '++' '>='
     && lk != 177923                // Identifier '--' '>='
     && lk != 177924                // Null '--' '>='
     && lk != 177925                // True '--' '>='
     && lk != 177926                // False '--' '>='
     && lk != 177927                // Character '--' '>='
     && lk != 177928                // String '--' '>='
     && lk != 177929                // Real '--' '>='
     && lk != 179247                // '[' ']' '>='
     && lk != 181763                // Identifier '++' '>>'
     && lk != 181764                // Null '++' '>>'
     && lk != 181765                // True '++' '>>'
     && lk != 181766                // False '++' '>>'
     && lk != 181767                // Character '++' '>>'
     && lk != 181768                // String '++' '>>'
     && lk != 181769                // Real '++' '>>'
     && lk != 182019                // Identifier '--' '>>'
     && lk != 182020                // Null '--' '>>'
     && lk != 182021                // True '--' '>>'
     && lk != 182022                // False '--' '>>'
     && lk != 182023                // Character '--' '>>'
     && lk != 182024                // String '--' '>>'
     && lk != 182025                // Real '--' '>>'
     && lk != 183343                // '[' ']' '>>'
     && lk != 185859                // Identifier '++' '>>='
     && lk != 185860                // Null '++' '>>='
     && lk != 185861                // True '++' '>>='
     && lk != 185862                // False '++' '>>='
     && lk != 185863                // Character '++' '>>='
     && lk != 185864                // String '++' '>>='
     && lk != 185865                // Real '++' '>>='
     && lk != 186115                // Identifier '--' '>>='
     && lk != 186116                // Null '--' '>>='
     && lk != 186117                // True '--' '>>='
     && lk != 186118                // False '--' '>>='
     && lk != 186119                // Character '--' '>>='
     && lk != 186120                // String '--' '>>='
     && lk != 186121                // Real '--' '>>='
     && lk != 187439                // '[' ']' '>>='
     && lk != 189955                // Identifier '++' '?'
     && lk != 189956                // Null '++' '?'
     && lk != 189957                // True '++' '?'
     && lk != 189958                // False '++' '?'
     && lk != 189959                // Character '++' '?'
     && lk != 189960                // String '++' '?'
     && lk != 189961                // Real '++' '?'
     && lk != 190211                // Identifier '--' '?'
     && lk != 190212                // Null '--' '?'
     && lk != 190213                // True '--' '?'
     && lk != 190214                // False '--' '?'
     && lk != 190215                // Character '--' '?'
     && lk != 190216                // String '--' '?'
     && lk != 190217                // Real '--' '?'
     && lk != 191535                // '[' ']' '?'
     && lk != 195631                // '[' ']' '['
     && lk != 198147                // Identifier '++' ']'
     && lk != 198148                // Null '++' ']'
     && lk != 198149                // True '++' ']'
     && lk != 198150                // False '++' ']'
     && lk != 198151                // Character '++' ']'
     && lk != 198152                // String '++' ']'
     && lk != 198153                // Real '++' ']'
     && lk != 198403                // Identifier '--' ']'
     && lk != 198404                // Null '--' ']'
     && lk != 198405                // True '--' ']'
     && lk != 198406                // False '--' ']'
     && lk != 198407                // Character '--' ']'
     && lk != 198408                // String '--' ']'
     && lk != 198409                // Real '--' ']'
     && lk != 199619                // Identifier '[' ']'
     && lk != 199727                // '[' ']' ']'
     && lk != 202243                // Identifier '++' '^'
     && lk != 202244                // Null '++' '^'
     && lk != 202245                // True '++' '^'
     && lk != 202246                // False '++' '^'
     && lk != 202247                // Character '++' '^'
     && lk != 202248                // String '++' '^'
     && lk != 202249                // Real '++' '^'
     && lk != 202499                // Identifier '--' '^'
     && lk != 202500                // Null '--' '^'
     && lk != 202501                // True '--' '^'
     && lk != 202502                // False '--' '^'
     && lk != 202503                // Character '--' '^'
     && lk != 202504                // String '--' '^'
     && lk != 202505                // Real '--' '^'
     && lk != 203823                // '[' ']' '^'
     && lk != 206339                // Identifier '++' '^='
     && lk != 206340                // Null '++' '^='
     && lk != 206341                // True '++' '^='
     && lk != 206342                // False '++' '^='
     && lk != 206343                // Character '++' '^='
     && lk != 206344                // String '++' '^='
     && lk != 206345                // Real '++' '^='
     && lk != 206595                // Identifier '--' '^='
     && lk != 206596                // Null '--' '^='
     && lk != 206597                // True '--' '^='
     && lk != 206598                // False '--' '^='
     && lk != 206599                // Character '--' '^='
     && lk != 206600                // String '--' '^='
     && lk != 206601                // Real '--' '^='
     && lk != 207919                // '[' ']' '^='
     && lk != 210435                // Identifier '++' 'char'
     && lk != 210436                // Null '++' 'char'
     && lk != 210437                // True '++' 'char'
     && lk != 210438                // False '++' 'char'
     && lk != 210439                // Character '++' 'char'
     && lk != 210440                // String '++' 'char'
     && lk != 210441                // Real '++' 'char'
     && lk != 210691                // Identifier '--' 'char'
     && lk != 210692                // Null '--' 'char'
     && lk != 210693                // True '--' 'char'
     && lk != 210694                // False '--' 'char'
     && lk != 210695                // Character '--' 'char'
     && lk != 210696                // String '--' 'char'
     && lk != 210697                // Real '--' 'char'
     && lk != 212015                // '[' ']' 'char'
     && lk != 214531                // Identifier '++' 'double'
     && lk != 214532                // Null '++' 'double'
     && lk != 214533                // True '++' 'double'
     && lk != 214534                // False '++' 'double'
     && lk != 214535                // Character '++' 'double'
     && lk != 214536                // String '++' 'double'
     && lk != 214537                // Real '++' 'double'
     && lk != 214787                // Identifier '--' 'double'
     && lk != 214788                // Null '--' 'double'
     && lk != 214789                // True '--' 'double'
     && lk != 214790                // False '--' 'double'
     && lk != 214791                // Character '--' 'double'
     && lk != 214792                // String '--' 'double'
     && lk != 214793                // Real '--' 'double'
     && lk != 216111                // '[' ']' 'double'
     && lk != 218627                // Identifier '++' 'float'
     && lk != 218628                // Null '++' 'float'
     && lk != 218629                // True '++' 'float'
     && lk != 218630                // False '++' 'float'
     && lk != 218631                // Character '++' 'float'
     && lk != 218632                // String '++' 'float'
     && lk != 218633                // Real '++' 'float'
     && lk != 218883                // Identifier '--' 'float'
     && lk != 218884                // Null '--' 'float'
     && lk != 218885                // True '--' 'float'
     && lk != 218886                // False '--' 'float'
     && lk != 218887                // Character '--' 'float'
     && lk != 218888                // String '--' 'float'
     && lk != 218889                // Real '--' 'float'
     && lk != 220207                // '[' ']' 'float'
     && lk != 222723                // Identifier '++' 'int'
     && lk != 222724                // Null '++' 'int'
     && lk != 222725                // True '++' 'int'
     && lk != 222726                // False '++' 'int'
     && lk != 222727                // Character '++' 'int'
     && lk != 222728                // String '++' 'int'
     && lk != 222729                // Real '++' 'int'
     && lk != 222979                // Identifier '--' 'int'
     && lk != 222980                // Null '--' 'int'
     && lk != 222981                // True '--' 'int'
     && lk != 222982                // False '--' 'int'
     && lk != 222983                // Character '--' 'int'
     && lk != 222984                // String '--' 'int'
     && lk != 222985                // Real '--' 'int'
     && lk != 224303                // '[' ']' 'int'
     && lk != 226819                // Identifier '++' 'long'
     && lk != 226820                // Null '++' 'long'
     && lk != 226821                // True '++' 'long'
     && lk != 226822                // False '++' 'long'
     && lk != 226823                // Character '++' 'long'
     && lk != 226824                // String '++' 'long'
     && lk != 226825                // Real '++' 'long'
     && lk != 227075                // Identifier '--' 'long'
     && lk != 227076                // Null '--' 'long'
     && lk != 227077                // True '--' 'long'
     && lk != 227078                // False '--' 'long'
     && lk != 227079                // Character '--' 'long'
     && lk != 227080                // String '--' 'long'
     && lk != 227081                // Real '--' 'long'
     && lk != 228399                // '[' ']' 'long'
     && lk != 232495                // '[' ']' '{'
     && lk != 235011                // Identifier '++' '|'
     && lk != 235012                // Null '++' '|'
     && lk != 235013                // True '++' '|'
     && lk != 235014                // False '++' '|'
     && lk != 235015                // Character '++' '|'
     && lk != 235016                // String '++' '|'
     && lk != 235017                // Real '++' '|'
     && lk != 235267                // Identifier '--' '|'
     && lk != 235268                // Null '--' '|'
     && lk != 235269                // True '--' '|'
     && lk != 235270                // False '--' '|'
     && lk != 235271                // Character '--' '|'
     && lk != 235272                // String '--' '|'
     && lk != 235273                // Real '--' '|'
     && lk != 236591                // '[' ']' '|'
     && lk != 239107                // Identifier '++' '|='
     && lk != 239108                // Null '++' '|='
     && lk != 239109                // True '++' '|='
     && lk != 239110                // False '++' '|='
     && lk != 239111                // Character '++' '|='
     && lk != 239112                // String '++' '|='
     && lk != 239113                // Real '++' '|='
     && lk != 239363                // Identifier '--' '|='
     && lk != 239364                // Null '--' '|='
     && lk != 239365                // True '--' '|='
     && lk != 239366                // False '--' '|='
     && lk != 239367                // Character '--' '|='
     && lk != 239368                // String '--' '|='
     && lk != 239369                // Real '--' '|='
     && lk != 240687                // '[' ']' '|='
     && lk != 243203                // Identifier '++' '||'
     && lk != 243204                // Null '++' '||'
     && lk != 243205                // True '++' '||'
     && lk != 243206                // False '++' '||'
     && lk != 243207                // Character '++' '||'
     && lk != 243208                // String '++' '||'
     && lk != 243209                // Real '++' '||'
     && lk != 243459                // Identifier '--' '||'
     && lk != 243460                // Null '--' '||'
     && lk != 243461                // True '--' '||'
     && lk != 243462                // False '--' '||'
     && lk != 243463                // Character '--' '||'
     && lk != 243464                // String '--' '||'
     && lk != 243465                // Real '--' '||'
     && lk != 244783                // '[' ']' '||'
     && lk != 247299                // Identifier '++' '}'
     && lk != 247300                // Null '++' '}'
     && lk != 247301                // True '++' '}'
     && lk != 247302                // False '++' '}'
     && lk != 247303                // Character '++' '}'
     && lk != 247304                // String '++' '}'
     && lk != 247305                // Real '++' '}'
     && lk != 247555                // Identifier '--' '}'
     && lk != 247556                // Null '--' '}'
     && lk != 247557                // True '--' '}'
     && lk != 247558                // False '--' '}'
     && lk != 247559                // Character '--' '}'
     && lk != 247560                // String '--' '}'
     && lk != 247561                // Real '--' '}'
     && lk != 248879                // '[' ']' '}'
     && lk != 251395                // Identifier '++' '~'
     && lk != 251396                // Null '++' '~'
     && lk != 251397                // True '++' '~'
     && lk != 251398                // False '++' '~'
     && lk != 251399                // Character '++' '~'
     && lk != 251400                // String '++' '~'
     && lk != 251401                // Real '++' '~'
     && lk != 251651                // Identifier '--' '~'
     && lk != 251652                // Null '--' '~'
     && lk != 251653                // True '--' '~'
     && lk != 251654                // False '--' '~'
     && lk != 251655                // Character '--' '~'
     && lk != 251656                // String '--' '~'
     && lk != 251657                // Real '--' '~'
     && lk != 252975)               // '[' ']' '~'
    {
      lk = memoized(2, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          try_Primary();
          lookahead1W(2);           // WhiteSpace^token | '++'
          consumeT(24);             // '++'
          lk = -5;
        }
        catch (p5A)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            try_Primary();
            lookahead1W(3);         // WhiteSpace^token | '--'
            consumeT(28);           // '--'
            lk = -6;
          }
          catch (p6A)
          {
            lk = -7;
          }
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
        b3 = b3A; e3 = e3A; end = e3A; }}}
        memoize(2, e0, lk);
      }
    }
    switch (lk)
    {
    case 61:                        // '~'
      consume(61);                  // '~'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      whitespace();
      parse_Primary();
      break;
    case 12:                        // '!'
      consume(12);                  // '!'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      whitespace();
      parse_Primary();
      break;
    case 24:                        // '++'
      consume(24);                  // '++'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      whitespace();
      parse_Primary();
      break;
    case 28:                        // '--'
      consume(28);                  // '--'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      whitespace();
      parse_Primary();
      break;
    case -5:
    case 5635:                      // Identifier '++' END
    case 5636:                      // Null '++' END
    case 5637:                      // True '++' END
    case 5638:                      // False '++' END
    case 5639:                      // Character '++' END
    case 5640:                      // String '++' END
    case 5641:                      // Real '++' END
    case 42499:                     // Identifier '++' Comment
    case 42500:                     // Null '++' Comment
    case 42501:                     // True '++' Comment
    case 42502:                     // False '++' Comment
    case 42503:                     // Character '++' Comment
    case 42504:                     // String '++' Comment
    case 42505:                     // Real '++' Comment
    case 50691:                     // Identifier '++' '!'
    case 50692:                     // Null '++' '!'
    case 50693:                     // True '++' '!'
    case 50694:                     // False '++' '!'
    case 50695:                     // Character '++' '!'
    case 50696:                     // String '++' '!'
    case 50697:                     // Real '++' '!'
    case 54787:                     // Identifier '++' '!='
    case 54788:                     // Null '++' '!='
    case 54789:                     // True '++' '!='
    case 54790:                     // False '++' '!='
    case 54791:                     // Character '++' '!='
    case 54792:                     // String '++' '!='
    case 54793:                     // Real '++' '!='
    case 58883:                     // Identifier '++' '%'
    case 58884:                     // Null '++' '%'
    case 58885:                     // True '++' '%'
    case 58886:                     // False '++' '%'
    case 58887:                     // Character '++' '%'
    case 58888:                     // String '++' '%'
    case 58889:                     // Real '++' '%'
    case 62979:                     // Identifier '++' '%='
    case 62980:                     // Null '++' '%='
    case 62981:                     // True '++' '%='
    case 62982:                     // False '++' '%='
    case 62983:                     // Character '++' '%='
    case 62984:                     // String '++' '%='
    case 62985:                     // Real '++' '%='
    case 67075:                     // Identifier '++' '&'
    case 67076:                     // Null '++' '&'
    case 67077:                     // True '++' '&'
    case 67078:                     // False '++' '&'
    case 67079:                     // Character '++' '&'
    case 67080:                     // String '++' '&'
    case 67081:                     // Real '++' '&'
    case 71171:                     // Identifier '++' '&&'
    case 71172:                     // Null '++' '&&'
    case 71173:                     // True '++' '&&'
    case 71174:                     // False '++' '&&'
    case 71175:                     // Character '++' '&&'
    case 71176:                     // String '++' '&&'
    case 71177:                     // Real '++' '&&'
    case 75267:                     // Identifier '++' '&='
    case 75268:                     // Null '++' '&='
    case 75269:                     // True '++' '&='
    case 75270:                     // False '++' '&='
    case 75271:                     // Character '++' '&='
    case 75272:                     // String '++' '&='
    case 75273:                     // Real '++' '&='
    case 83459:                     // Identifier '++' ')'
    case 83460:                     // Null '++' ')'
    case 83461:                     // True '++' ')'
    case 83462:                     // False '++' ')'
    case 83463:                     // Character '++' ')'
    case 83464:                     // String '++' ')'
    case 83465:                     // Real '++' ')'
    case 87555:                     // Identifier '++' '*'
    case 87556:                     // Null '++' '*'
    case 87557:                     // True '++' '*'
    case 87558:                     // False '++' '*'
    case 87559:                     // Character '++' '*'
    case 87560:                     // String '++' '*'
    case 87561:                     // Real '++' '*'
    case 91651:                     // Identifier '++' '*='
    case 91652:                     // Null '++' '*='
    case 91653:                     // True '++' '*='
    case 91654:                     // False '++' '*='
    case 91655:                     // Character '++' '*='
    case 91656:                     // String '++' '*='
    case 91657:                     // Real '++' '*='
    case 95747:                     // Identifier '++' '+'
    case 95748:                     // Null '++' '+'
    case 95749:                     // True '++' '+'
    case 95750:                     // False '++' '+'
    case 95751:                     // Character '++' '+'
    case 95752:                     // String '++' '+'
    case 95753:                     // Real '++' '+'
    case 99843:                     // Identifier '++' '++'
    case 99844:                     // Null '++' '++'
    case 99845:                     // True '++' '++'
    case 99846:                     // False '++' '++'
    case 99847:                     // Character '++' '++'
    case 99848:                     // String '++' '++'
    case 99849:                     // Real '++' '++'
    case 103939:                    // Identifier '++' '+='
    case 103940:                    // Null '++' '+='
    case 103941:                    // True '++' '+='
    case 103942:                    // False '++' '+='
    case 103943:                    // Character '++' '+='
    case 103944:                    // String '++' '+='
    case 103945:                    // Real '++' '+='
    case 108035:                    // Identifier '++' ','
    case 108036:                    // Null '++' ','
    case 108037:                    // True '++' ','
    case 108038:                    // False '++' ','
    case 108039:                    // Character '++' ','
    case 108040:                    // String '++' ','
    case 108041:                    // Real '++' ','
    case 112131:                    // Identifier '++' '-'
    case 112132:                    // Null '++' '-'
    case 112133:                    // True '++' '-'
    case 112134:                    // False '++' '-'
    case 112135:                    // Character '++' '-'
    case 112136:                    // String '++' '-'
    case 112137:                    // Real '++' '-'
    case 116227:                    // Identifier '++' '--'
    case 116228:                    // Null '++' '--'
    case 116229:                    // True '++' '--'
    case 116230:                    // False '++' '--'
    case 116231:                    // Character '++' '--'
    case 116232:                    // String '++' '--'
    case 116233:                    // Real '++' '--'
    case 120323:                    // Identifier '++' '-='
    case 120324:                    // Null '++' '-='
    case 120325:                    // True '++' '-='
    case 120326:                    // False '++' '-='
    case 120327:                    // Character '++' '-='
    case 120328:                    // String '++' '-='
    case 120329:                    // Real '++' '-='
    case 132611:                    // Identifier '++' '/'
    case 132612:                    // Null '++' '/'
    case 132613:                    // True '++' '/'
    case 132614:                    // False '++' '/'
    case 132615:                    // Character '++' '/'
    case 132616:                    // String '++' '/'
    case 132617:                    // Real '++' '/'
    case 136707:                    // Identifier '++' '/='
    case 136708:                    // Null '++' '/='
    case 136709:                    // True '++' '/='
    case 136710:                    // False '++' '/='
    case 136711:                    // Character '++' '/='
    case 136712:                    // String '++' '/='
    case 136713:                    // Real '++' '/='
    case 140803:                    // Identifier '++' ':'
    case 140804:                    // Null '++' ':'
    case 140805:                    // True '++' ':'
    case 140806:                    // False '++' ':'
    case 140807:                    // Character '++' ':'
    case 140808:                    // String '++' ':'
    case 140809:                    // Real '++' ':'
    case 144899:                    // Identifier '++' ';'
    case 144900:                    // Null '++' ';'
    case 144901:                    // True '++' ';'
    case 144902:                    // False '++' ';'
    case 144903:                    // Character '++' ';'
    case 144904:                    // String '++' ';'
    case 144905:                    // Real '++' ';'
    case 148995:                    // Identifier '++' '<'
    case 148996:                    // Null '++' '<'
    case 148997:                    // True '++' '<'
    case 148998:                    // False '++' '<'
    case 148999:                    // Character '++' '<'
    case 149000:                    // String '++' '<'
    case 149001:                    // Real '++' '<'
    case 153091:                    // Identifier '++' '<<'
    case 153092:                    // Null '++' '<<'
    case 153093:                    // True '++' '<<'
    case 153094:                    // False '++' '<<'
    case 153095:                    // Character '++' '<<'
    case 153096:                    // String '++' '<<'
    case 153097:                    // Real '++' '<<'
    case 157187:                    // Identifier '++' '<<='
    case 157188:                    // Null '++' '<<='
    case 157189:                    // True '++' '<<='
    case 157190:                    // False '++' '<<='
    case 157191:                    // Character '++' '<<='
    case 157192:                    // String '++' '<<='
    case 157193:                    // Real '++' '<<='
    case 161283:                    // Identifier '++' '<='
    case 161284:                    // Null '++' '<='
    case 161285:                    // True '++' '<='
    case 161286:                    // False '++' '<='
    case 161287:                    // Character '++' '<='
    case 161288:                    // String '++' '<='
    case 161289:                    // Real '++' '<='
    case 165379:                    // Identifier '++' '='
    case 165380:                    // Null '++' '='
    case 165381:                    // True '++' '='
    case 165382:                    // False '++' '='
    case 165383:                    // Character '++' '='
    case 165384:                    // String '++' '='
    case 165385:                    // Real '++' '='
    case 169475:                    // Identifier '++' '=='
    case 169476:                    // Null '++' '=='
    case 169477:                    // True '++' '=='
    case 169478:                    // False '++' '=='
    case 169479:                    // Character '++' '=='
    case 169480:                    // String '++' '=='
    case 169481:                    // Real '++' '=='
    case 173571:                    // Identifier '++' '>'
    case 173572:                    // Null '++' '>'
    case 173573:                    // True '++' '>'
    case 173574:                    // False '++' '>'
    case 173575:                    // Character '++' '>'
    case 173576:                    // String '++' '>'
    case 173577:                    // Real '++' '>'
    case 177667:                    // Identifier '++' '>='
    case 177668:                    // Null '++' '>='
    case 177669:                    // True '++' '>='
    case 177670:                    // False '++' '>='
    case 177671:                    // Character '++' '>='
    case 177672:                    // String '++' '>='
    case 177673:                    // Real '++' '>='
    case 181763:                    // Identifier '++' '>>'
    case 181764:                    // Null '++' '>>'
    case 181765:                    // True '++' '>>'
    case 181766:                    // False '++' '>>'
    case 181767:                    // Character '++' '>>'
    case 181768:                    // String '++' '>>'
    case 181769:                    // Real '++' '>>'
    case 185859:                    // Identifier '++' '>>='
    case 185860:                    // Null '++' '>>='
    case 185861:                    // True '++' '>>='
    case 185862:                    // False '++' '>>='
    case 185863:                    // Character '++' '>>='
    case 185864:                    // String '++' '>>='
    case 185865:                    // Real '++' '>>='
    case 189955:                    // Identifier '++' '?'
    case 189956:                    // Null '++' '?'
    case 189957:                    // True '++' '?'
    case 189958:                    // False '++' '?'
    case 189959:                    // Character '++' '?'
    case 189960:                    // String '++' '?'
    case 189961:                    // Real '++' '?'
    case 198147:                    // Identifier '++' ']'
    case 198148:                    // Null '++' ']'
    case 198149:                    // True '++' ']'
    case 198150:                    // False '++' ']'
    case 198151:                    // Character '++' ']'
    case 198152:                    // String '++' ']'
    case 198153:                    // Real '++' ']'
    case 202243:                    // Identifier '++' '^'
    case 202244:                    // Null '++' '^'
    case 202245:                    // True '++' '^'
    case 202246:                    // False '++' '^'
    case 202247:                    // Character '++' '^'
    case 202248:                    // String '++' '^'
    case 202249:                    // Real '++' '^'
    case 206339:                    // Identifier '++' '^='
    case 206340:                    // Null '++' '^='
    case 206341:                    // True '++' '^='
    case 206342:                    // False '++' '^='
    case 206343:                    // Character '++' '^='
    case 206344:                    // String '++' '^='
    case 206345:                    // Real '++' '^='
    case 210435:                    // Identifier '++' 'char'
    case 210436:                    // Null '++' 'char'
    case 210437:                    // True '++' 'char'
    case 210438:                    // False '++' 'char'
    case 210439:                    // Character '++' 'char'
    case 210440:                    // String '++' 'char'
    case 210441:                    // Real '++' 'char'
    case 214531:                    // Identifier '++' 'double'
    case 214532:                    // Null '++' 'double'
    case 214533:                    // True '++' 'double'
    case 214534:                    // False '++' 'double'
    case 214535:                    // Character '++' 'double'
    case 214536:                    // String '++' 'double'
    case 214537:                    // Real '++' 'double'
    case 218627:                    // Identifier '++' 'float'
    case 218628:                    // Null '++' 'float'
    case 218629:                    // True '++' 'float'
    case 218630:                    // False '++' 'float'
    case 218631:                    // Character '++' 'float'
    case 218632:                    // String '++' 'float'
    case 218633:                    // Real '++' 'float'
    case 222723:                    // Identifier '++' 'int'
    case 222724:                    // Null '++' 'int'
    case 222725:                    // True '++' 'int'
    case 222726:                    // False '++' 'int'
    case 222727:                    // Character '++' 'int'
    case 222728:                    // String '++' 'int'
    case 222729:                    // Real '++' 'int'
    case 226819:                    // Identifier '++' 'long'
    case 226820:                    // Null '++' 'long'
    case 226821:                    // True '++' 'long'
    case 226822:                    // False '++' 'long'
    case 226823:                    // Character '++' 'long'
    case 226824:                    // String '++' 'long'
    case 226825:                    // Real '++' 'long'
    case 235011:                    // Identifier '++' '|'
    case 235012:                    // Null '++' '|'
    case 235013:                    // True '++' '|'
    case 235014:                    // False '++' '|'
    case 235015:                    // Character '++' '|'
    case 235016:                    // String '++' '|'
    case 235017:                    // Real '++' '|'
    case 239107:                    // Identifier '++' '|='
    case 239108:                    // Null '++' '|='
    case 239109:                    // True '++' '|='
    case 239110:                    // False '++' '|='
    case 239111:                    // Character '++' '|='
    case 239112:                    // String '++' '|='
    case 239113:                    // Real '++' '|='
    case 243203:                    // Identifier '++' '||'
    case 243204:                    // Null '++' '||'
    case 243205:                    // True '++' '||'
    case 243206:                    // False '++' '||'
    case 243207:                    // Character '++' '||'
    case 243208:                    // String '++' '||'
    case 243209:                    // Real '++' '||'
    case 247299:                    // Identifier '++' '}'
    case 247300:                    // Null '++' '}'
    case 247301:                    // True '++' '}'
    case 247302:                    // False '++' '}'
    case 247303:                    // Character '++' '}'
    case 247304:                    // String '++' '}'
    case 247305:                    // Real '++' '}'
    case 251395:                    // Identifier '++' '~'
    case 251396:                    // Null '++' '~'
    case 251397:                    // True '++' '~'
    case 251398:                    // False '++' '~'
    case 251399:                    // Character '++' '~'
    case 251400:                    // String '++' '~'
    case 251401:                    // Real '++' '~'
      parse_Primary();
      lookahead1W(2);               // WhiteSpace^token | '++'
      consume(24);                  // '++'
      break;
    case -6:
    case 5891:                      // Identifier '--' END
    case 5892:                      // Null '--' END
    case 5893:                      // True '--' END
    case 5894:                      // False '--' END
    case 5895:                      // Character '--' END
    case 5896:                      // String '--' END
    case 5897:                      // Real '--' END
    case 42755:                     // Identifier '--' Comment
    case 42756:                     // Null '--' Comment
    case 42757:                     // True '--' Comment
    case 42758:                     // False '--' Comment
    case 42759:                     // Character '--' Comment
    case 42760:                     // String '--' Comment
    case 42761:                     // Real '--' Comment
    case 50947:                     // Identifier '--' '!'
    case 50948:                     // Null '--' '!'
    case 50949:                     // True '--' '!'
    case 50950:                     // False '--' '!'
    case 50951:                     // Character '--' '!'
    case 50952:                     // String '--' '!'
    case 50953:                     // Real '--' '!'
    case 55043:                     // Identifier '--' '!='
    case 55044:                     // Null '--' '!='
    case 55045:                     // True '--' '!='
    case 55046:                     // False '--' '!='
    case 55047:                     // Character '--' '!='
    case 55048:                     // String '--' '!='
    case 55049:                     // Real '--' '!='
    case 59139:                     // Identifier '--' '%'
    case 59140:                     // Null '--' '%'
    case 59141:                     // True '--' '%'
    case 59142:                     // False '--' '%'
    case 59143:                     // Character '--' '%'
    case 59144:                     // String '--' '%'
    case 59145:                     // Real '--' '%'
    case 63235:                     // Identifier '--' '%='
    case 63236:                     // Null '--' '%='
    case 63237:                     // True '--' '%='
    case 63238:                     // False '--' '%='
    case 63239:                     // Character '--' '%='
    case 63240:                     // String '--' '%='
    case 63241:                     // Real '--' '%='
    case 67331:                     // Identifier '--' '&'
    case 67332:                     // Null '--' '&'
    case 67333:                     // True '--' '&'
    case 67334:                     // False '--' '&'
    case 67335:                     // Character '--' '&'
    case 67336:                     // String '--' '&'
    case 67337:                     // Real '--' '&'
    case 71427:                     // Identifier '--' '&&'
    case 71428:                     // Null '--' '&&'
    case 71429:                     // True '--' '&&'
    case 71430:                     // False '--' '&&'
    case 71431:                     // Character '--' '&&'
    case 71432:                     // String '--' '&&'
    case 71433:                     // Real '--' '&&'
    case 75523:                     // Identifier '--' '&='
    case 75524:                     // Null '--' '&='
    case 75525:                     // True '--' '&='
    case 75526:                     // False '--' '&='
    case 75527:                     // Character '--' '&='
    case 75528:                     // String '--' '&='
    case 75529:                     // Real '--' '&='
    case 83715:                     // Identifier '--' ')'
    case 83716:                     // Null '--' ')'
    case 83717:                     // True '--' ')'
    case 83718:                     // False '--' ')'
    case 83719:                     // Character '--' ')'
    case 83720:                     // String '--' ')'
    case 83721:                     // Real '--' ')'
    case 87811:                     // Identifier '--' '*'
    case 87812:                     // Null '--' '*'
    case 87813:                     // True '--' '*'
    case 87814:                     // False '--' '*'
    case 87815:                     // Character '--' '*'
    case 87816:                     // String '--' '*'
    case 87817:                     // Real '--' '*'
    case 91907:                     // Identifier '--' '*='
    case 91908:                     // Null '--' '*='
    case 91909:                     // True '--' '*='
    case 91910:                     // False '--' '*='
    case 91911:                     // Character '--' '*='
    case 91912:                     // String '--' '*='
    case 91913:                     // Real '--' '*='
    case 96003:                     // Identifier '--' '+'
    case 96004:                     // Null '--' '+'
    case 96005:                     // True '--' '+'
    case 96006:                     // False '--' '+'
    case 96007:                     // Character '--' '+'
    case 96008:                     // String '--' '+'
    case 96009:                     // Real '--' '+'
    case 100099:                    // Identifier '--' '++'
    case 100100:                    // Null '--' '++'
    case 100101:                    // True '--' '++'
    case 100102:                    // False '--' '++'
    case 100103:                    // Character '--' '++'
    case 100104:                    // String '--' '++'
    case 100105:                    // Real '--' '++'
    case 104195:                    // Identifier '--' '+='
    case 104196:                    // Null '--' '+='
    case 104197:                    // True '--' '+='
    case 104198:                    // False '--' '+='
    case 104199:                    // Character '--' '+='
    case 104200:                    // String '--' '+='
    case 104201:                    // Real '--' '+='
    case 108291:                    // Identifier '--' ','
    case 108292:                    // Null '--' ','
    case 108293:                    // True '--' ','
    case 108294:                    // False '--' ','
    case 108295:                    // Character '--' ','
    case 108296:                    // String '--' ','
    case 108297:                    // Real '--' ','
    case 112387:                    // Identifier '--' '-'
    case 112388:                    // Null '--' '-'
    case 112389:                    // True '--' '-'
    case 112390:                    // False '--' '-'
    case 112391:                    // Character '--' '-'
    case 112392:                    // String '--' '-'
    case 112393:                    // Real '--' '-'
    case 116483:                    // Identifier '--' '--'
    case 116484:                    // Null '--' '--'
    case 116485:                    // True '--' '--'
    case 116486:                    // False '--' '--'
    case 116487:                    // Character '--' '--'
    case 116488:                    // String '--' '--'
    case 116489:                    // Real '--' '--'
    case 120579:                    // Identifier '--' '-='
    case 120580:                    // Null '--' '-='
    case 120581:                    // True '--' '-='
    case 120582:                    // False '--' '-='
    case 120583:                    // Character '--' '-='
    case 120584:                    // String '--' '-='
    case 120585:                    // Real '--' '-='
    case 132867:                    // Identifier '--' '/'
    case 132868:                    // Null '--' '/'
    case 132869:                    // True '--' '/'
    case 132870:                    // False '--' '/'
    case 132871:                    // Character '--' '/'
    case 132872:                    // String '--' '/'
    case 132873:                    // Real '--' '/'
    case 136963:                    // Identifier '--' '/='
    case 136964:                    // Null '--' '/='
    case 136965:                    // True '--' '/='
    case 136966:                    // False '--' '/='
    case 136967:                    // Character '--' '/='
    case 136968:                    // String '--' '/='
    case 136969:                    // Real '--' '/='
    case 141059:                    // Identifier '--' ':'
    case 141060:                    // Null '--' ':'
    case 141061:                    // True '--' ':'
    case 141062:                    // False '--' ':'
    case 141063:                    // Character '--' ':'
    case 141064:                    // String '--' ':'
    case 141065:                    // Real '--' ':'
    case 145155:                    // Identifier '--' ';'
    case 145156:                    // Null '--' ';'
    case 145157:                    // True '--' ';'
    case 145158:                    // False '--' ';'
    case 145159:                    // Character '--' ';'
    case 145160:                    // String '--' ';'
    case 145161:                    // Real '--' ';'
    case 149251:                    // Identifier '--' '<'
    case 149252:                    // Null '--' '<'
    case 149253:                    // True '--' '<'
    case 149254:                    // False '--' '<'
    case 149255:                    // Character '--' '<'
    case 149256:                    // String '--' '<'
    case 149257:                    // Real '--' '<'
    case 153347:                    // Identifier '--' '<<'
    case 153348:                    // Null '--' '<<'
    case 153349:                    // True '--' '<<'
    case 153350:                    // False '--' '<<'
    case 153351:                    // Character '--' '<<'
    case 153352:                    // String '--' '<<'
    case 153353:                    // Real '--' '<<'
    case 157443:                    // Identifier '--' '<<='
    case 157444:                    // Null '--' '<<='
    case 157445:                    // True '--' '<<='
    case 157446:                    // False '--' '<<='
    case 157447:                    // Character '--' '<<='
    case 157448:                    // String '--' '<<='
    case 157449:                    // Real '--' '<<='
    case 161539:                    // Identifier '--' '<='
    case 161540:                    // Null '--' '<='
    case 161541:                    // True '--' '<='
    case 161542:                    // False '--' '<='
    case 161543:                    // Character '--' '<='
    case 161544:                    // String '--' '<='
    case 161545:                    // Real '--' '<='
    case 165635:                    // Identifier '--' '='
    case 165636:                    // Null '--' '='
    case 165637:                    // True '--' '='
    case 165638:                    // False '--' '='
    case 165639:                    // Character '--' '='
    case 165640:                    // String '--' '='
    case 165641:                    // Real '--' '='
    case 169731:                    // Identifier '--' '=='
    case 169732:                    // Null '--' '=='
    case 169733:                    // True '--' '=='
    case 169734:                    // False '--' '=='
    case 169735:                    // Character '--' '=='
    case 169736:                    // String '--' '=='
    case 169737:                    // Real '--' '=='
    case 173827:                    // Identifier '--' '>'
    case 173828:                    // Null '--' '>'
    case 173829:                    // True '--' '>'
    case 173830:                    // False '--' '>'
    case 173831:                    // Character '--' '>'
    case 173832:                    // String '--' '>'
    case 173833:                    // Real '--' '>'
    case 177923:                    // Identifier '--' '>='
    case 177924:                    // Null '--' '>='
    case 177925:                    // True '--' '>='
    case 177926:                    // False '--' '>='
    case 177927:                    // Character '--' '>='
    case 177928:                    // String '--' '>='
    case 177929:                    // Real '--' '>='
    case 182019:                    // Identifier '--' '>>'
    case 182020:                    // Null '--' '>>'
    case 182021:                    // True '--' '>>'
    case 182022:                    // False '--' '>>'
    case 182023:                    // Character '--' '>>'
    case 182024:                    // String '--' '>>'
    case 182025:                    // Real '--' '>>'
    case 186115:                    // Identifier '--' '>>='
    case 186116:                    // Null '--' '>>='
    case 186117:                    // True '--' '>>='
    case 186118:                    // False '--' '>>='
    case 186119:                    // Character '--' '>>='
    case 186120:                    // String '--' '>>='
    case 186121:                    // Real '--' '>>='
    case 190211:                    // Identifier '--' '?'
    case 190212:                    // Null '--' '?'
    case 190213:                    // True '--' '?'
    case 190214:                    // False '--' '?'
    case 190215:                    // Character '--' '?'
    case 190216:                    // String '--' '?'
    case 190217:                    // Real '--' '?'
    case 198403:                    // Identifier '--' ']'
    case 198404:                    // Null '--' ']'
    case 198405:                    // True '--' ']'
    case 198406:                    // False '--' ']'
    case 198407:                    // Character '--' ']'
    case 198408:                    // String '--' ']'
    case 198409:                    // Real '--' ']'
    case 202499:                    // Identifier '--' '^'
    case 202500:                    // Null '--' '^'
    case 202501:                    // True '--' '^'
    case 202502:                    // False '--' '^'
    case 202503:                    // Character '--' '^'
    case 202504:                    // String '--' '^'
    case 202505:                    // Real '--' '^'
    case 206595:                    // Identifier '--' '^='
    case 206596:                    // Null '--' '^='
    case 206597:                    // True '--' '^='
    case 206598:                    // False '--' '^='
    case 206599:                    // Character '--' '^='
    case 206600:                    // String '--' '^='
    case 206601:                    // Real '--' '^='
    case 210691:                    // Identifier '--' 'char'
    case 210692:                    // Null '--' 'char'
    case 210693:                    // True '--' 'char'
    case 210694:                    // False '--' 'char'
    case 210695:                    // Character '--' 'char'
    case 210696:                    // String '--' 'char'
    case 210697:                    // Real '--' 'char'
    case 214787:                    // Identifier '--' 'double'
    case 214788:                    // Null '--' 'double'
    case 214789:                    // True '--' 'double'
    case 214790:                    // False '--' 'double'
    case 214791:                    // Character '--' 'double'
    case 214792:                    // String '--' 'double'
    case 214793:                    // Real '--' 'double'
    case 218883:                    // Identifier '--' 'float'
    case 218884:                    // Null '--' 'float'
    case 218885:                    // True '--' 'float'
    case 218886:                    // False '--' 'float'
    case 218887:                    // Character '--' 'float'
    case 218888:                    // String '--' 'float'
    case 218889:                    // Real '--' 'float'
    case 222979:                    // Identifier '--' 'int'
    case 222980:                    // Null '--' 'int'
    case 222981:                    // True '--' 'int'
    case 222982:                    // False '--' 'int'
    case 222983:                    // Character '--' 'int'
    case 222984:                    // String '--' 'int'
    case 222985:                    // Real '--' 'int'
    case 227075:                    // Identifier '--' 'long'
    case 227076:                    // Null '--' 'long'
    case 227077:                    // True '--' 'long'
    case 227078:                    // False '--' 'long'
    case 227079:                    // Character '--' 'long'
    case 227080:                    // String '--' 'long'
    case 227081:                    // Real '--' 'long'
    case 235267:                    // Identifier '--' '|'
    case 235268:                    // Null '--' '|'
    case 235269:                    // True '--' '|'
    case 235270:                    // False '--' '|'
    case 235271:                    // Character '--' '|'
    case 235272:                    // String '--' '|'
    case 235273:                    // Real '--' '|'
    case 239363:                    // Identifier '--' '|='
    case 239364:                    // Null '--' '|='
    case 239365:                    // True '--' '|='
    case 239366:                    // False '--' '|='
    case 239367:                    // Character '--' '|='
    case 239368:                    // String '--' '|='
    case 239369:                    // Real '--' '|='
    case 243459:                    // Identifier '--' '||'
    case 243460:                    // Null '--' '||'
    case 243461:                    // True '--' '||'
    case 243462:                    // False '--' '||'
    case 243463:                    // Character '--' '||'
    case 243464:                    // String '--' '||'
    case 243465:                    // Real '--' '||'
    case 247555:                    // Identifier '--' '}'
    case 247556:                    // Null '--' '}'
    case 247557:                    // True '--' '}'
    case 247558:                    // False '--' '}'
    case 247559:                    // Character '--' '}'
    case 247560:                    // String '--' '}'
    case 247561:                    // Real '--' '}'
    case 251651:                    // Identifier '--' '~'
    case 251652:                    // Null '--' '~'
    case 251653:                    // True '--' '~'
    case 251654:                    // False '--' '~'
    case 251655:                    // Character '--' '~'
    case 251656:                    // String '--' '~'
    case 251657:                    // Real '--' '~'
      parse_Primary();
      lookahead1W(3);               // WhiteSpace^token | '--'
      consume(28);                  // '--'
      break;
    default:
      parse_Primary();
    }
    eventHandler.endNonterminal("UnaryExpression", e0);
  }

  function try_UnaryExpression()
  {
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 1219:                    // Identifier '('
        lookahead3W(12);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 3011:                    // Identifier '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 1539:                    // Identifier '++'
      case 1795:                    // Identifier '--'
        lookahead3W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        break;
      case 1923:                    // Identifier '->'
      case 1987:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    case 19:                        // '('
      lookahead2W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 211:                     // '(' Identifier
        lookahead3W(21);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' | '^' |
                                    // '^=' | '|' | '|=' | '||'
        break;
      case 3027:                    // '(' '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 659:                     // '(' Comment
      case 2259:                    // '(' ';'
        lookahead3W(1);             // WhiteSpace^token | ')'
        break;
      case 787:                     // '(' '!'
      case 1555:                    // '(' '++'
      case 1811:                    // '(' '--'
      case 3923:                    // '(' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 275:                     // '(' Null
      case 339:                     // '(' True
      case 403:                     // '(' False
      case 467:                     // '(' Character
      case 531:                     // '(' String
      case 595:                     // '(' Real
        lookahead3W(17);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 1235:                    // '(' '('
      case 3283:                    // '(' 'char'
      case 3347:                    // '(' 'double'
      case 3411:                    // '(' 'float'
      case 3475:                    // '(' 'int'
      case 3539:                    // '(' 'long'
      case 3603:                    // '(' '{'
        lookahead3W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    case 47:                        // '['
      lookahead2W(13);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 239:                     // '[' Identifier
        lookahead3W(23);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 687:                     // '[' Comment
        lookahead3W(7);             // WhiteSpace^token | ',' | ';' | ']'
        break;
      case 2287:                    // '[' ';'
        lookahead3W(15);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 3055:                    // '[' '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 3119:                    // '[' ']'
        lookahead3W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        break;
      case 815:                     // '[' '!'
      case 1583:                    // '[' '++'
      case 1839:                    // '[' '--'
      case 3951:                    // '[' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 303:                     // '[' Null
      case 367:                     // '[' True
      case 431:                     // '[' False
      case 495:                     // '[' Character
      case 559:                     // '[' String
      case 623:                     // '[' Real
        lookahead3W(20);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
        break;
      case 1263:                    // '[' '('
      case 3311:                    // '[' 'char'
      case 3375:                    // '[' 'double'
      case 3439:                    // '[' 'float'
      case 3503:                    // '[' 'int'
      case 3567:                    // '[' 'long'
      case 3631:                    // '[' '{'
        lookahead3W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    case 56:                        // '{'
      lookahead2W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 248:                     // '{' Identifier
        lookahead3W(22);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
        break;
      case 568:                     // '{' String
        lookahead3W(19);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
        break;
      case 3064:                    // '{' '['
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 696:                     // '{' Comment
      case 2296:                    // '{' ';'
        lookahead3W(5);             // WhiteSpace^token | ',' | '}'
        break;
      case 824:                     // '{' '!'
      case 1592:                    // '{' '++'
      case 1848:                    // '{' '--'
      case 3960:                    // '{' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 312:                     // '{' Null
      case 376:                     // '{' True
      case 440:                     // '{' False
      case 504:                     // '{' Character
      case 632:                     // '{' Real
        lookahead3W(18);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||' |
                                    // '}'
        break;
      case 1272:                    // '{' '('
      case 3320:                    // '{' 'char'
      case 3384:                    // '{' 'double'
      case 3448:                    // '{' 'float'
      case 3512:                    // '{' 'int'
      case 3576:                    // '{' 'long'
      case 3640:                    // '{' '{'
        lookahead3W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    case 4:                         // Null
    case 5:                         // True
    case 6:                         // False
    case 7:                         // Character
    case 8:                         // String
    case 9:                         // Real
      lookahead2W(24);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 1540:                    // Null '++'
      case 1796:                    // Null '--'
      case 1541:                    // True '++'
      case 1797:                    // True '--'
      case 1542:                    // False '++'
      case 1798:                    // False '--'
      case 1543:                    // Character '++'
      case 1799:                    // Character '--'
      case 1544:                    // String '++'
      case 1800:                    // String '--'
      case 1545:                    // Real '++'
      case 1801:                    // Real '--'
        lookahead3W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk != 12                    // '!'
     && lk != 24                    // '++'
     && lk != 28                    // '--'
     && lk != 61                    // '~'
     && lk != 67                    // Identifier END
     && lk != 68                    // Null END
     && lk != 69                    // True END
     && lk != 70                    // False END
     && lk != 71                    // Character END
     && lk != 72                    // String END
     && lk != 73                    // Real END
     && lk != 195                   // Identifier Identifier
     && lk != 196                   // Null Identifier
     && lk != 197                   // True Identifier
     && lk != 198                   // False Identifier
     && lk != 199                   // Character Identifier
     && lk != 200                   // String Identifier
     && lk != 201                   // Real Identifier
     && lk != 259                   // Identifier Null
     && lk != 260                   // Null Null
     && lk != 261                   // True Null
     && lk != 262                   // False Null
     && lk != 263                   // Character Null
     && lk != 264                   // String Null
     && lk != 265                   // Real Null
     && lk != 323                   // Identifier True
     && lk != 324                   // Null True
     && lk != 325                   // True True
     && lk != 326                   // False True
     && lk != 327                   // Character True
     && lk != 328                   // String True
     && lk != 329                   // Real True
     && lk != 387                   // Identifier False
     && lk != 388                   // Null False
     && lk != 389                   // True False
     && lk != 390                   // False False
     && lk != 391                   // Character False
     && lk != 392                   // String False
     && lk != 393                   // Real False
     && lk != 451                   // Identifier Character
     && lk != 452                   // Null Character
     && lk != 453                   // True Character
     && lk != 454                   // False Character
     && lk != 455                   // Character Character
     && lk != 456                   // String Character
     && lk != 457                   // Real Character
     && lk != 515                   // Identifier String
     && lk != 516                   // Null String
     && lk != 517                   // True String
     && lk != 518                   // False String
     && lk != 519                   // Character String
     && lk != 520                   // String String
     && lk != 521                   // Real String
     && lk != 579                   // Identifier Real
     && lk != 580                   // Null Real
     && lk != 581                   // True Real
     && lk != 582                   // False Real
     && lk != 583                   // Character Real
     && lk != 584                   // String Real
     && lk != 585                   // Real Real
     && lk != 643                   // Identifier Comment
     && lk != 644                   // Null Comment
     && lk != 645                   // True Comment
     && lk != 646                   // False Comment
     && lk != 647                   // Character Comment
     && lk != 648                   // String Comment
     && lk != 649                   // Real Comment
     && lk != 771                   // Identifier '!'
     && lk != 772                   // Null '!'
     && lk != 773                   // True '!'
     && lk != 774                   // False '!'
     && lk != 775                   // Character '!'
     && lk != 776                   // String '!'
     && lk != 777                   // Real '!'
     && lk != 835                   // Identifier '!='
     && lk != 836                   // Null '!='
     && lk != 837                   // True '!='
     && lk != 838                   // False '!='
     && lk != 839                   // Character '!='
     && lk != 840                   // String '!='
     && lk != 841                   // Real '!='
     && lk != 899                   // Identifier '%'
     && lk != 900                   // Null '%'
     && lk != 901                   // True '%'
     && lk != 902                   // False '%'
     && lk != 903                   // Character '%'
     && lk != 904                   // String '%'
     && lk != 905                   // Real '%'
     && lk != 963                   // Identifier '%='
     && lk != 964                   // Null '%='
     && lk != 965                   // True '%='
     && lk != 966                   // False '%='
     && lk != 967                   // Character '%='
     && lk != 968                   // String '%='
     && lk != 969                   // Real '%='
     && lk != 1027                  // Identifier '&'
     && lk != 1028                  // Null '&'
     && lk != 1029                  // True '&'
     && lk != 1030                  // False '&'
     && lk != 1031                  // Character '&'
     && lk != 1032                  // String '&'
     && lk != 1033                  // Real '&'
     && lk != 1091                  // Identifier '&&'
     && lk != 1092                  // Null '&&'
     && lk != 1093                  // True '&&'
     && lk != 1094                  // False '&&'
     && lk != 1095                  // Character '&&'
     && lk != 1096                  // String '&&'
     && lk != 1097                  // Real '&&'
     && lk != 1155                  // Identifier '&='
     && lk != 1156                  // Null '&='
     && lk != 1157                  // True '&='
     && lk != 1158                  // False '&='
     && lk != 1159                  // Character '&='
     && lk != 1160                  // String '&='
     && lk != 1161                  // Real '&='
     && lk != 1220                  // Null '('
     && lk != 1221                  // True '('
     && lk != 1222                  // False '('
     && lk != 1223                  // Character '('
     && lk != 1224                  // String '('
     && lk != 1225                  // Real '('
     && lk != 1283                  // Identifier ')'
     && lk != 1284                  // Null ')'
     && lk != 1285                  // True ')'
     && lk != 1286                  // False ')'
     && lk != 1287                  // Character ')'
     && lk != 1288                  // String ')'
     && lk != 1289                  // Real ')'
     && lk != 1347                  // Identifier '*'
     && lk != 1348                  // Null '*'
     && lk != 1349                  // True '*'
     && lk != 1350                  // False '*'
     && lk != 1351                  // Character '*'
     && lk != 1352                  // String '*'
     && lk != 1353                  // Real '*'
     && lk != 1411                  // Identifier '*='
     && lk != 1412                  // Null '*='
     && lk != 1413                  // True '*='
     && lk != 1414                  // False '*='
     && lk != 1415                  // Character '*='
     && lk != 1416                  // String '*='
     && lk != 1417                  // Real '*='
     && lk != 1475                  // Identifier '+'
     && lk != 1476                  // Null '+'
     && lk != 1477                  // True '+'
     && lk != 1478                  // False '+'
     && lk != 1479                  // Character '+'
     && lk != 1480                  // String '+'
     && lk != 1481                  // Real '+'
     && lk != 1603                  // Identifier '+='
     && lk != 1604                  // Null '+='
     && lk != 1605                  // True '+='
     && lk != 1606                  // False '+='
     && lk != 1607                  // Character '+='
     && lk != 1608                  // String '+='
     && lk != 1609                  // Real '+='
     && lk != 1667                  // Identifier ','
     && lk != 1668                  // Null ','
     && lk != 1669                  // True ','
     && lk != 1670                  // False ','
     && lk != 1671                  // Character ','
     && lk != 1672                  // String ','
     && lk != 1673                  // Real ','
     && lk != 1731                  // Identifier '-'
     && lk != 1732                  // Null '-'
     && lk != 1733                  // True '-'
     && lk != 1734                  // False '-'
     && lk != 1735                  // Character '-'
     && lk != 1736                  // String '-'
     && lk != 1737                  // Real '-'
     && lk != 1859                  // Identifier '-='
     && lk != 1860                  // Null '-='
     && lk != 1861                  // True '-='
     && lk != 1862                  // False '-='
     && lk != 1863                  // Character '-='
     && lk != 1864                  // String '-='
     && lk != 1865                  // Real '-='
     && lk != 2051                  // Identifier '/'
     && lk != 2052                  // Null '/'
     && lk != 2053                  // True '/'
     && lk != 2054                  // False '/'
     && lk != 2055                  // Character '/'
     && lk != 2056                  // String '/'
     && lk != 2057                  // Real '/'
     && lk != 2115                  // Identifier '/='
     && lk != 2116                  // Null '/='
     && lk != 2117                  // True '/='
     && lk != 2118                  // False '/='
     && lk != 2119                  // Character '/='
     && lk != 2120                  // String '/='
     && lk != 2121                  // Real '/='
     && lk != 2179                  // Identifier ':'
     && lk != 2180                  // Null ':'
     && lk != 2181                  // True ':'
     && lk != 2182                  // False ':'
     && lk != 2183                  // Character ':'
     && lk != 2184                  // String ':'
     && lk != 2185                  // Real ':'
     && lk != 2243                  // Identifier ';'
     && lk != 2244                  // Null ';'
     && lk != 2245                  // True ';'
     && lk != 2246                  // False ';'
     && lk != 2247                  // Character ';'
     && lk != 2248                  // String ';'
     && lk != 2249                  // Real ';'
     && lk != 2307                  // Identifier '<'
     && lk != 2308                  // Null '<'
     && lk != 2309                  // True '<'
     && lk != 2310                  // False '<'
     && lk != 2311                  // Character '<'
     && lk != 2312                  // String '<'
     && lk != 2313                  // Real '<'
     && lk != 2371                  // Identifier '<<'
     && lk != 2372                  // Null '<<'
     && lk != 2373                  // True '<<'
     && lk != 2374                  // False '<<'
     && lk != 2375                  // Character '<<'
     && lk != 2376                  // String '<<'
     && lk != 2377                  // Real '<<'
     && lk != 2435                  // Identifier '<<='
     && lk != 2436                  // Null '<<='
     && lk != 2437                  // True '<<='
     && lk != 2438                  // False '<<='
     && lk != 2439                  // Character '<<='
     && lk != 2440                  // String '<<='
     && lk != 2441                  // Real '<<='
     && lk != 2499                  // Identifier '<='
     && lk != 2500                  // Null '<='
     && lk != 2501                  // True '<='
     && lk != 2502                  // False '<='
     && lk != 2503                  // Character '<='
     && lk != 2504                  // String '<='
     && lk != 2505                  // Real '<='
     && lk != 2563                  // Identifier '='
     && lk != 2564                  // Null '='
     && lk != 2565                  // True '='
     && lk != 2566                  // False '='
     && lk != 2567                  // Character '='
     && lk != 2568                  // String '='
     && lk != 2569                  // Real '='
     && lk != 2627                  // Identifier '=='
     && lk != 2628                  // Null '=='
     && lk != 2629                  // True '=='
     && lk != 2630                  // False '=='
     && lk != 2631                  // Character '=='
     && lk != 2632                  // String '=='
     && lk != 2633                  // Real '=='
     && lk != 2691                  // Identifier '>'
     && lk != 2692                  // Null '>'
     && lk != 2693                  // True '>'
     && lk != 2694                  // False '>'
     && lk != 2695                  // Character '>'
     && lk != 2696                  // String '>'
     && lk != 2697                  // Real '>'
     && lk != 2755                  // Identifier '>='
     && lk != 2756                  // Null '>='
     && lk != 2757                  // True '>='
     && lk != 2758                  // False '>='
     && lk != 2759                  // Character '>='
     && lk != 2760                  // String '>='
     && lk != 2761                  // Real '>='
     && lk != 2819                  // Identifier '>>'
     && lk != 2820                  // Null '>>'
     && lk != 2821                  // True '>>'
     && lk != 2822                  // False '>>'
     && lk != 2823                  // Character '>>'
     && lk != 2824                  // String '>>'
     && lk != 2825                  // Real '>>'
     && lk != 2883                  // Identifier '>>='
     && lk != 2884                  // Null '>>='
     && lk != 2885                  // True '>>='
     && lk != 2886                  // False '>>='
     && lk != 2887                  // Character '>>='
     && lk != 2888                  // String '>>='
     && lk != 2889                  // Real '>>='
     && lk != 2947                  // Identifier '?'
     && lk != 2948                  // Null '?'
     && lk != 2949                  // True '?'
     && lk != 2950                  // False '?'
     && lk != 2951                  // Character '?'
     && lk != 2952                  // String '?'
     && lk != 2953                  // Real '?'
     && lk != 3012                  // Null '['
     && lk != 3013                  // True '['
     && lk != 3014                  // False '['
     && lk != 3015                  // Character '['
     && lk != 3016                  // String '['
     && lk != 3017                  // Real '['
     && lk != 3075                  // Identifier ']'
     && lk != 3076                  // Null ']'
     && lk != 3077                  // True ']'
     && lk != 3078                  // False ']'
     && lk != 3079                  // Character ']'
     && lk != 3080                  // String ']'
     && lk != 3081                  // Real ']'
     && lk != 3139                  // Identifier '^'
     && lk != 3140                  // Null '^'
     && lk != 3141                  // True '^'
     && lk != 3142                  // False '^'
     && lk != 3143                  // Character '^'
     && lk != 3144                  // String '^'
     && lk != 3145                  // Real '^'
     && lk != 3203                  // Identifier '^='
     && lk != 3204                  // Null '^='
     && lk != 3205                  // True '^='
     && lk != 3206                  // False '^='
     && lk != 3207                  // Character '^='
     && lk != 3208                  // String '^='
     && lk != 3209                  // Real '^='
     && lk != 3267                  // Identifier 'char'
     && lk != 3268                  // Null 'char'
     && lk != 3269                  // True 'char'
     && lk != 3270                  // False 'char'
     && lk != 3271                  // Character 'char'
     && lk != 3272                  // String 'char'
     && lk != 3273                  // Real 'char'
     && lk != 3331                  // Identifier 'double'
     && lk != 3332                  // Null 'double'
     && lk != 3333                  // True 'double'
     && lk != 3334                  // False 'double'
     && lk != 3335                  // Character 'double'
     && lk != 3336                  // String 'double'
     && lk != 3337                  // Real 'double'
     && lk != 3395                  // Identifier 'float'
     && lk != 3396                  // Null 'float'
     && lk != 3397                  // True 'float'
     && lk != 3398                  // False 'float'
     && lk != 3399                  // Character 'float'
     && lk != 3400                  // String 'float'
     && lk != 3401                  // Real 'float'
     && lk != 3459                  // Identifier 'int'
     && lk != 3460                  // Null 'int'
     && lk != 3461                  // True 'int'
     && lk != 3462                  // False 'int'
     && lk != 3463                  // Character 'int'
     && lk != 3464                  // String 'int'
     && lk != 3465                  // Real 'int'
     && lk != 3523                  // Identifier 'long'
     && lk != 3524                  // Null 'long'
     && lk != 3525                  // True 'long'
     && lk != 3526                  // False 'long'
     && lk != 3527                  // Character 'long'
     && lk != 3528                  // String 'long'
     && lk != 3529                  // Real 'long'
     && lk != 3587                  // Identifier '{'
     && lk != 3588                  // Null '{'
     && lk != 3589                  // True '{'
     && lk != 3590                  // False '{'
     && lk != 3591                  // Character '{'
     && lk != 3592                  // String '{'
     && lk != 3593                  // Real '{'
     && lk != 3651                  // Identifier '|'
     && lk != 3652                  // Null '|'
     && lk != 3653                  // True '|'
     && lk != 3654                  // False '|'
     && lk != 3655                  // Character '|'
     && lk != 3656                  // String '|'
     && lk != 3657                  // Real '|'
     && lk != 3715                  // Identifier '|='
     && lk != 3716                  // Null '|='
     && lk != 3717                  // True '|='
     && lk != 3718                  // False '|='
     && lk != 3719                  // Character '|='
     && lk != 3720                  // String '|='
     && lk != 3721                  // Real '|='
     && lk != 3779                  // Identifier '||'
     && lk != 3780                  // Null '||'
     && lk != 3781                  // True '||'
     && lk != 3782                  // False '||'
     && lk != 3783                  // Character '||'
     && lk != 3784                  // String '||'
     && lk != 3785                  // Real '||'
     && lk != 3843                  // Identifier '}'
     && lk != 3844                  // Null '}'
     && lk != 3845                  // True '}'
     && lk != 3846                  // False '}'
     && lk != 3847                  // Character '}'
     && lk != 3848                  // String '}'
     && lk != 3849                  // Real '}'
     && lk != 3907                  // Identifier '~'
     && lk != 3908                  // Null '~'
     && lk != 3909                  // True '~'
     && lk != 3910                  // False '~'
     && lk != 3911                  // Character '~'
     && lk != 3912                  // String '~'
     && lk != 3913                  // Real '~'
     && lk != 5635                  // Identifier '++' END
     && lk != 5636                  // Null '++' END
     && lk != 5637                  // True '++' END
     && lk != 5638                  // False '++' END
     && lk != 5639                  // Character '++' END
     && lk != 5640                  // String '++' END
     && lk != 5641                  // Real '++' END
     && lk != 5891                  // Identifier '--' END
     && lk != 5892                  // Null '--' END
     && lk != 5893                  // True '--' END
     && lk != 5894                  // False '--' END
     && lk != 5895                  // Character '--' END
     && lk != 5896                  // String '--' END
     && lk != 5897                  // Real '--' END
     && lk != 7215                  // '[' ']' END
     && lk != 15407                 // '[' ']' Identifier
     && lk != 19503                 // '[' ']' Null
     && lk != 23599                 // '[' ']' True
     && lk != 27695                 // '[' ']' False
     && lk != 31791                 // '[' ']' Character
     && lk != 35887                 // '[' ']' String
     && lk != 39983                 // '[' ']' Real
     && lk != 42499                 // Identifier '++' Comment
     && lk != 42500                 // Null '++' Comment
     && lk != 42501                 // True '++' Comment
     && lk != 42502                 // False '++' Comment
     && lk != 42503                 // Character '++' Comment
     && lk != 42504                 // String '++' Comment
     && lk != 42505                 // Real '++' Comment
     && lk != 42755                 // Identifier '--' Comment
     && lk != 42756                 // Null '--' Comment
     && lk != 42757                 // True '--' Comment
     && lk != 42758                 // False '--' Comment
     && lk != 42759                 // Character '--' Comment
     && lk != 42760                 // String '--' Comment
     && lk != 42761                 // Real '--' Comment
     && lk != 44079                 // '[' ']' Comment
     && lk != 50691                 // Identifier '++' '!'
     && lk != 50692                 // Null '++' '!'
     && lk != 50693                 // True '++' '!'
     && lk != 50694                 // False '++' '!'
     && lk != 50695                 // Character '++' '!'
     && lk != 50696                 // String '++' '!'
     && lk != 50697                 // Real '++' '!'
     && lk != 50947                 // Identifier '--' '!'
     && lk != 50948                 // Null '--' '!'
     && lk != 50949                 // True '--' '!'
     && lk != 50950                 // False '--' '!'
     && lk != 50951                 // Character '--' '!'
     && lk != 50952                 // String '--' '!'
     && lk != 50953                 // Real '--' '!'
     && lk != 52271                 // '[' ']' '!'
     && lk != 54787                 // Identifier '++' '!='
     && lk != 54788                 // Null '++' '!='
     && lk != 54789                 // True '++' '!='
     && lk != 54790                 // False '++' '!='
     && lk != 54791                 // Character '++' '!='
     && lk != 54792                 // String '++' '!='
     && lk != 54793                 // Real '++' '!='
     && lk != 55043                 // Identifier '--' '!='
     && lk != 55044                 // Null '--' '!='
     && lk != 55045                 // True '--' '!='
     && lk != 55046                 // False '--' '!='
     && lk != 55047                 // Character '--' '!='
     && lk != 55048                 // String '--' '!='
     && lk != 55049                 // Real '--' '!='
     && lk != 56367                 // '[' ']' '!='
     && lk != 58883                 // Identifier '++' '%'
     && lk != 58884                 // Null '++' '%'
     && lk != 58885                 // True '++' '%'
     && lk != 58886                 // False '++' '%'
     && lk != 58887                 // Character '++' '%'
     && lk != 58888                 // String '++' '%'
     && lk != 58889                 // Real '++' '%'
     && lk != 59139                 // Identifier '--' '%'
     && lk != 59140                 // Null '--' '%'
     && lk != 59141                 // True '--' '%'
     && lk != 59142                 // False '--' '%'
     && lk != 59143                 // Character '--' '%'
     && lk != 59144                 // String '--' '%'
     && lk != 59145                 // Real '--' '%'
     && lk != 60463                 // '[' ']' '%'
     && lk != 62979                 // Identifier '++' '%='
     && lk != 62980                 // Null '++' '%='
     && lk != 62981                 // True '++' '%='
     && lk != 62982                 // False '++' '%='
     && lk != 62983                 // Character '++' '%='
     && lk != 62984                 // String '++' '%='
     && lk != 62985                 // Real '++' '%='
     && lk != 63235                 // Identifier '--' '%='
     && lk != 63236                 // Null '--' '%='
     && lk != 63237                 // True '--' '%='
     && lk != 63238                 // False '--' '%='
     && lk != 63239                 // Character '--' '%='
     && lk != 63240                 // String '--' '%='
     && lk != 63241                 // Real '--' '%='
     && lk != 64559                 // '[' ']' '%='
     && lk != 67075                 // Identifier '++' '&'
     && lk != 67076                 // Null '++' '&'
     && lk != 67077                 // True '++' '&'
     && lk != 67078                 // False '++' '&'
     && lk != 67079                 // Character '++' '&'
     && lk != 67080                 // String '++' '&'
     && lk != 67081                 // Real '++' '&'
     && lk != 67331                 // Identifier '--' '&'
     && lk != 67332                 // Null '--' '&'
     && lk != 67333                 // True '--' '&'
     && lk != 67334                 // False '--' '&'
     && lk != 67335                 // Character '--' '&'
     && lk != 67336                 // String '--' '&'
     && lk != 67337                 // Real '--' '&'
     && lk != 68655                 // '[' ']' '&'
     && lk != 71171                 // Identifier '++' '&&'
     && lk != 71172                 // Null '++' '&&'
     && lk != 71173                 // True '++' '&&'
     && lk != 71174                 // False '++' '&&'
     && lk != 71175                 // Character '++' '&&'
     && lk != 71176                 // String '++' '&&'
     && lk != 71177                 // Real '++' '&&'
     && lk != 71427                 // Identifier '--' '&&'
     && lk != 71428                 // Null '--' '&&'
     && lk != 71429                 // True '--' '&&'
     && lk != 71430                 // False '--' '&&'
     && lk != 71431                 // Character '--' '&&'
     && lk != 71432                 // String '--' '&&'
     && lk != 71433                 // Real '--' '&&'
     && lk != 72751                 // '[' ']' '&&'
     && lk != 75267                 // Identifier '++' '&='
     && lk != 75268                 // Null '++' '&='
     && lk != 75269                 // True '++' '&='
     && lk != 75270                 // False '++' '&='
     && lk != 75271                 // Character '++' '&='
     && lk != 75272                 // String '++' '&='
     && lk != 75273                 // Real '++' '&='
     && lk != 75523                 // Identifier '--' '&='
     && lk != 75524                 // Null '--' '&='
     && lk != 75525                 // True '--' '&='
     && lk != 75526                 // False '--' '&='
     && lk != 75527                 // Character '--' '&='
     && lk != 75528                 // String '--' '&='
     && lk != 75529                 // Real '--' '&='
     && lk != 76847                 // '[' ']' '&='
     && lk != 80943                 // '[' ']' '('
     && lk != 83459                 // Identifier '++' ')'
     && lk != 83460                 // Null '++' ')'
     && lk != 83461                 // True '++' ')'
     && lk != 83462                 // False '++' ')'
     && lk != 83463                 // Character '++' ')'
     && lk != 83464                 // String '++' ')'
     && lk != 83465                 // Real '++' ')'
     && lk != 83715                 // Identifier '--' ')'
     && lk != 83716                 // Null '--' ')'
     && lk != 83717                 // True '--' ')'
     && lk != 83718                 // False '--' ')'
     && lk != 83719                 // Character '--' ')'
     && lk != 83720                 // String '--' ')'
     && lk != 83721                 // Real '--' ')'
     && lk != 85039                 // '[' ']' ')'
     && lk != 87555                 // Identifier '++' '*'
     && lk != 87556                 // Null '++' '*'
     && lk != 87557                 // True '++' '*'
     && lk != 87558                 // False '++' '*'
     && lk != 87559                 // Character '++' '*'
     && lk != 87560                 // String '++' '*'
     && lk != 87561                 // Real '++' '*'
     && lk != 87811                 // Identifier '--' '*'
     && lk != 87812                 // Null '--' '*'
     && lk != 87813                 // True '--' '*'
     && lk != 87814                 // False '--' '*'
     && lk != 87815                 // Character '--' '*'
     && lk != 87816                 // String '--' '*'
     && lk != 87817                 // Real '--' '*'
     && lk != 89135                 // '[' ']' '*'
     && lk != 91651                 // Identifier '++' '*='
     && lk != 91652                 // Null '++' '*='
     && lk != 91653                 // True '++' '*='
     && lk != 91654                 // False '++' '*='
     && lk != 91655                 // Character '++' '*='
     && lk != 91656                 // String '++' '*='
     && lk != 91657                 // Real '++' '*='
     && lk != 91907                 // Identifier '--' '*='
     && lk != 91908                 // Null '--' '*='
     && lk != 91909                 // True '--' '*='
     && lk != 91910                 // False '--' '*='
     && lk != 91911                 // Character '--' '*='
     && lk != 91912                 // String '--' '*='
     && lk != 91913                 // Real '--' '*='
     && lk != 93231                 // '[' ']' '*='
     && lk != 95747                 // Identifier '++' '+'
     && lk != 95748                 // Null '++' '+'
     && lk != 95749                 // True '++' '+'
     && lk != 95750                 // False '++' '+'
     && lk != 95751                 // Character '++' '+'
     && lk != 95752                 // String '++' '+'
     && lk != 95753                 // Real '++' '+'
     && lk != 96003                 // Identifier '--' '+'
     && lk != 96004                 // Null '--' '+'
     && lk != 96005                 // True '--' '+'
     && lk != 96006                 // False '--' '+'
     && lk != 96007                 // Character '--' '+'
     && lk != 96008                 // String '--' '+'
     && lk != 96009                 // Real '--' '+'
     && lk != 97327                 // '[' ']' '+'
     && lk != 99843                 // Identifier '++' '++'
     && lk != 99844                 // Null '++' '++'
     && lk != 99845                 // True '++' '++'
     && lk != 99846                 // False '++' '++'
     && lk != 99847                 // Character '++' '++'
     && lk != 99848                 // String '++' '++'
     && lk != 99849                 // Real '++' '++'
     && lk != 100099                // Identifier '--' '++'
     && lk != 100100                // Null '--' '++'
     && lk != 100101                // True '--' '++'
     && lk != 100102                // False '--' '++'
     && lk != 100103                // Character '--' '++'
     && lk != 100104                // String '--' '++'
     && lk != 100105                // Real '--' '++'
     && lk != 103939                // Identifier '++' '+='
     && lk != 103940                // Null '++' '+='
     && lk != 103941                // True '++' '+='
     && lk != 103942                // False '++' '+='
     && lk != 103943                // Character '++' '+='
     && lk != 103944                // String '++' '+='
     && lk != 103945                // Real '++' '+='
     && lk != 104195                // Identifier '--' '+='
     && lk != 104196                // Null '--' '+='
     && lk != 104197                // True '--' '+='
     && lk != 104198                // False '--' '+='
     && lk != 104199                // Character '--' '+='
     && lk != 104200                // String '--' '+='
     && lk != 104201                // Real '--' '+='
     && lk != 105519                // '[' ']' '+='
     && lk != 108035                // Identifier '++' ','
     && lk != 108036                // Null '++' ','
     && lk != 108037                // True '++' ','
     && lk != 108038                // False '++' ','
     && lk != 108039                // Character '++' ','
     && lk != 108040                // String '++' ','
     && lk != 108041                // Real '++' ','
     && lk != 108291                // Identifier '--' ','
     && lk != 108292                // Null '--' ','
     && lk != 108293                // True '--' ','
     && lk != 108294                // False '--' ','
     && lk != 108295                // Character '--' ','
     && lk != 108296                // String '--' ','
     && lk != 108297                // Real '--' ','
     && lk != 109615                // '[' ']' ','
     && lk != 112131                // Identifier '++' '-'
     && lk != 112132                // Null '++' '-'
     && lk != 112133                // True '++' '-'
     && lk != 112134                // False '++' '-'
     && lk != 112135                // Character '++' '-'
     && lk != 112136                // String '++' '-'
     && lk != 112137                // Real '++' '-'
     && lk != 112387                // Identifier '--' '-'
     && lk != 112388                // Null '--' '-'
     && lk != 112389                // True '--' '-'
     && lk != 112390                // False '--' '-'
     && lk != 112391                // Character '--' '-'
     && lk != 112392                // String '--' '-'
     && lk != 112393                // Real '--' '-'
     && lk != 113711                // '[' ']' '-'
     && lk != 116227                // Identifier '++' '--'
     && lk != 116228                // Null '++' '--'
     && lk != 116229                // True '++' '--'
     && lk != 116230                // False '++' '--'
     && lk != 116231                // Character '++' '--'
     && lk != 116232                // String '++' '--'
     && lk != 116233                // Real '++' '--'
     && lk != 116483                // Identifier '--' '--'
     && lk != 116484                // Null '--' '--'
     && lk != 116485                // True '--' '--'
     && lk != 116486                // False '--' '--'
     && lk != 116487                // Character '--' '--'
     && lk != 116488                // String '--' '--'
     && lk != 116489                // Real '--' '--'
     && lk != 120323                // Identifier '++' '-='
     && lk != 120324                // Null '++' '-='
     && lk != 120325                // True '++' '-='
     && lk != 120326                // False '++' '-='
     && lk != 120327                // Character '++' '-='
     && lk != 120328                // String '++' '-='
     && lk != 120329                // Real '++' '-='
     && lk != 120579                // Identifier '--' '-='
     && lk != 120580                // Null '--' '-='
     && lk != 120581                // True '--' '-='
     && lk != 120582                // False '--' '-='
     && lk != 120583                // Character '--' '-='
     && lk != 120584                // String '--' '-='
     && lk != 120585                // Real '--' '-='
     && lk != 121903                // '[' ']' '-='
     && lk != 132611                // Identifier '++' '/'
     && lk != 132612                // Null '++' '/'
     && lk != 132613                // True '++' '/'
     && lk != 132614                // False '++' '/'
     && lk != 132615                // Character '++' '/'
     && lk != 132616                // String '++' '/'
     && lk != 132617                // Real '++' '/'
     && lk != 132867                // Identifier '--' '/'
     && lk != 132868                // Null '--' '/'
     && lk != 132869                // True '--' '/'
     && lk != 132870                // False '--' '/'
     && lk != 132871                // Character '--' '/'
     && lk != 132872                // String '--' '/'
     && lk != 132873                // Real '--' '/'
     && lk != 134191                // '[' ']' '/'
     && lk != 136707                // Identifier '++' '/='
     && lk != 136708                // Null '++' '/='
     && lk != 136709                // True '++' '/='
     && lk != 136710                // False '++' '/='
     && lk != 136711                // Character '++' '/='
     && lk != 136712                // String '++' '/='
     && lk != 136713                // Real '++' '/='
     && lk != 136963                // Identifier '--' '/='
     && lk != 136964                // Null '--' '/='
     && lk != 136965                // True '--' '/='
     && lk != 136966                // False '--' '/='
     && lk != 136967                // Character '--' '/='
     && lk != 136968                // String '--' '/='
     && lk != 136969                // Real '--' '/='
     && lk != 138287                // '[' ']' '/='
     && lk != 140803                // Identifier '++' ':'
     && lk != 140804                // Null '++' ':'
     && lk != 140805                // True '++' ':'
     && lk != 140806                // False '++' ':'
     && lk != 140807                // Character '++' ':'
     && lk != 140808                // String '++' ':'
     && lk != 140809                // Real '++' ':'
     && lk != 141059                // Identifier '--' ':'
     && lk != 141060                // Null '--' ':'
     && lk != 141061                // True '--' ':'
     && lk != 141062                // False '--' ':'
     && lk != 141063                // Character '--' ':'
     && lk != 141064                // String '--' ':'
     && lk != 141065                // Real '--' ':'
     && lk != 142383                // '[' ']' ':'
     && lk != 144899                // Identifier '++' ';'
     && lk != 144900                // Null '++' ';'
     && lk != 144901                // True '++' ';'
     && lk != 144902                // False '++' ';'
     && lk != 144903                // Character '++' ';'
     && lk != 144904                // String '++' ';'
     && lk != 144905                // Real '++' ';'
     && lk != 145155                // Identifier '--' ';'
     && lk != 145156                // Null '--' ';'
     && lk != 145157                // True '--' ';'
     && lk != 145158                // False '--' ';'
     && lk != 145159                // Character '--' ';'
     && lk != 145160                // String '--' ';'
     && lk != 145161                // Real '--' ';'
     && lk != 146479                // '[' ']' ';'
     && lk != 148995                // Identifier '++' '<'
     && lk != 148996                // Null '++' '<'
     && lk != 148997                // True '++' '<'
     && lk != 148998                // False '++' '<'
     && lk != 148999                // Character '++' '<'
     && lk != 149000                // String '++' '<'
     && lk != 149001                // Real '++' '<'
     && lk != 149251                // Identifier '--' '<'
     && lk != 149252                // Null '--' '<'
     && lk != 149253                // True '--' '<'
     && lk != 149254                // False '--' '<'
     && lk != 149255                // Character '--' '<'
     && lk != 149256                // String '--' '<'
     && lk != 149257                // Real '--' '<'
     && lk != 150575                // '[' ']' '<'
     && lk != 153091                // Identifier '++' '<<'
     && lk != 153092                // Null '++' '<<'
     && lk != 153093                // True '++' '<<'
     && lk != 153094                // False '++' '<<'
     && lk != 153095                // Character '++' '<<'
     && lk != 153096                // String '++' '<<'
     && lk != 153097                // Real '++' '<<'
     && lk != 153347                // Identifier '--' '<<'
     && lk != 153348                // Null '--' '<<'
     && lk != 153349                // True '--' '<<'
     && lk != 153350                // False '--' '<<'
     && lk != 153351                // Character '--' '<<'
     && lk != 153352                // String '--' '<<'
     && lk != 153353                // Real '--' '<<'
     && lk != 154671                // '[' ']' '<<'
     && lk != 157187                // Identifier '++' '<<='
     && lk != 157188                // Null '++' '<<='
     && lk != 157189                // True '++' '<<='
     && lk != 157190                // False '++' '<<='
     && lk != 157191                // Character '++' '<<='
     && lk != 157192                // String '++' '<<='
     && lk != 157193                // Real '++' '<<='
     && lk != 157443                // Identifier '--' '<<='
     && lk != 157444                // Null '--' '<<='
     && lk != 157445                // True '--' '<<='
     && lk != 157446                // False '--' '<<='
     && lk != 157447                // Character '--' '<<='
     && lk != 157448                // String '--' '<<='
     && lk != 157449                // Real '--' '<<='
     && lk != 158767                // '[' ']' '<<='
     && lk != 161283                // Identifier '++' '<='
     && lk != 161284                // Null '++' '<='
     && lk != 161285                // True '++' '<='
     && lk != 161286                // False '++' '<='
     && lk != 161287                // Character '++' '<='
     && lk != 161288                // String '++' '<='
     && lk != 161289                // Real '++' '<='
     && lk != 161539                // Identifier '--' '<='
     && lk != 161540                // Null '--' '<='
     && lk != 161541                // True '--' '<='
     && lk != 161542                // False '--' '<='
     && lk != 161543                // Character '--' '<='
     && lk != 161544                // String '--' '<='
     && lk != 161545                // Real '--' '<='
     && lk != 162863                // '[' ']' '<='
     && lk != 165379                // Identifier '++' '='
     && lk != 165380                // Null '++' '='
     && lk != 165381                // True '++' '='
     && lk != 165382                // False '++' '='
     && lk != 165383                // Character '++' '='
     && lk != 165384                // String '++' '='
     && lk != 165385                // Real '++' '='
     && lk != 165635                // Identifier '--' '='
     && lk != 165636                // Null '--' '='
     && lk != 165637                // True '--' '='
     && lk != 165638                // False '--' '='
     && lk != 165639                // Character '--' '='
     && lk != 165640                // String '--' '='
     && lk != 165641                // Real '--' '='
     && lk != 166959                // '[' ']' '='
     && lk != 169475                // Identifier '++' '=='
     && lk != 169476                // Null '++' '=='
     && lk != 169477                // True '++' '=='
     && lk != 169478                // False '++' '=='
     && lk != 169479                // Character '++' '=='
     && lk != 169480                // String '++' '=='
     && lk != 169481                // Real '++' '=='
     && lk != 169731                // Identifier '--' '=='
     && lk != 169732                // Null '--' '=='
     && lk != 169733                // True '--' '=='
     && lk != 169734                // False '--' '=='
     && lk != 169735                // Character '--' '=='
     && lk != 169736                // String '--' '=='
     && lk != 169737                // Real '--' '=='
     && lk != 171055                // '[' ']' '=='
     && lk != 173571                // Identifier '++' '>'
     && lk != 173572                // Null '++' '>'
     && lk != 173573                // True '++' '>'
     && lk != 173574                // False '++' '>'
     && lk != 173575                // Character '++' '>'
     && lk != 173576                // String '++' '>'
     && lk != 173577                // Real '++' '>'
     && lk != 173827                // Identifier '--' '>'
     && lk != 173828                // Null '--' '>'
     && lk != 173829                // True '--' '>'
     && lk != 173830                // False '--' '>'
     && lk != 173831                // Character '--' '>'
     && lk != 173832                // String '--' '>'
     && lk != 173833                // Real '--' '>'
     && lk != 175151                // '[' ']' '>'
     && lk != 177667                // Identifier '++' '>='
     && lk != 177668                // Null '++' '>='
     && lk != 177669                // True '++' '>='
     && lk != 177670                // False '++' '>='
     && lk != 177671                // Character '++' '>='
     && lk != 177672                // String '++' '>='
     && lk != 177673                // Real '++' '>='
     && lk != 177923                // Identifier '--' '>='
     && lk != 177924                // Null '--' '>='
     && lk != 177925                // True '--' '>='
     && lk != 177926                // False '--' '>='
     && lk != 177927                // Character '--' '>='
     && lk != 177928                // String '--' '>='
     && lk != 177929                // Real '--' '>='
     && lk != 179247                // '[' ']' '>='
     && lk != 181763                // Identifier '++' '>>'
     && lk != 181764                // Null '++' '>>'
     && lk != 181765                // True '++' '>>'
     && lk != 181766                // False '++' '>>'
     && lk != 181767                // Character '++' '>>'
     && lk != 181768                // String '++' '>>'
     && lk != 181769                // Real '++' '>>'
     && lk != 182019                // Identifier '--' '>>'
     && lk != 182020                // Null '--' '>>'
     && lk != 182021                // True '--' '>>'
     && lk != 182022                // False '--' '>>'
     && lk != 182023                // Character '--' '>>'
     && lk != 182024                // String '--' '>>'
     && lk != 182025                // Real '--' '>>'
     && lk != 183343                // '[' ']' '>>'
     && lk != 185859                // Identifier '++' '>>='
     && lk != 185860                // Null '++' '>>='
     && lk != 185861                // True '++' '>>='
     && lk != 185862                // False '++' '>>='
     && lk != 185863                // Character '++' '>>='
     && lk != 185864                // String '++' '>>='
     && lk != 185865                // Real '++' '>>='
     && lk != 186115                // Identifier '--' '>>='
     && lk != 186116                // Null '--' '>>='
     && lk != 186117                // True '--' '>>='
     && lk != 186118                // False '--' '>>='
     && lk != 186119                // Character '--' '>>='
     && lk != 186120                // String '--' '>>='
     && lk != 186121                // Real '--' '>>='
     && lk != 187439                // '[' ']' '>>='
     && lk != 189955                // Identifier '++' '?'
     && lk != 189956                // Null '++' '?'
     && lk != 189957                // True '++' '?'
     && lk != 189958                // False '++' '?'
     && lk != 189959                // Character '++' '?'
     && lk != 189960                // String '++' '?'
     && lk != 189961                // Real '++' '?'
     && lk != 190211                // Identifier '--' '?'
     && lk != 190212                // Null '--' '?'
     && lk != 190213                // True '--' '?'
     && lk != 190214                // False '--' '?'
     && lk != 190215                // Character '--' '?'
     && lk != 190216                // String '--' '?'
     && lk != 190217                // Real '--' '?'
     && lk != 191535                // '[' ']' '?'
     && lk != 195631                // '[' ']' '['
     && lk != 198147                // Identifier '++' ']'
     && lk != 198148                // Null '++' ']'
     && lk != 198149                // True '++' ']'
     && lk != 198150                // False '++' ']'
     && lk != 198151                // Character '++' ']'
     && lk != 198152                // String '++' ']'
     && lk != 198153                // Real '++' ']'
     && lk != 198403                // Identifier '--' ']'
     && lk != 198404                // Null '--' ']'
     && lk != 198405                // True '--' ']'
     && lk != 198406                // False '--' ']'
     && lk != 198407                // Character '--' ']'
     && lk != 198408                // String '--' ']'
     && lk != 198409                // Real '--' ']'
     && lk != 199619                // Identifier '[' ']'
     && lk != 199727                // '[' ']' ']'
     && lk != 202243                // Identifier '++' '^'
     && lk != 202244                // Null '++' '^'
     && lk != 202245                // True '++' '^'
     && lk != 202246                // False '++' '^'
     && lk != 202247                // Character '++' '^'
     && lk != 202248                // String '++' '^'
     && lk != 202249                // Real '++' '^'
     && lk != 202499                // Identifier '--' '^'
     && lk != 202500                // Null '--' '^'
     && lk != 202501                // True '--' '^'
     && lk != 202502                // False '--' '^'
     && lk != 202503                // Character '--' '^'
     && lk != 202504                // String '--' '^'
     && lk != 202505                // Real '--' '^'
     && lk != 203823                // '[' ']' '^'
     && lk != 206339                // Identifier '++' '^='
     && lk != 206340                // Null '++' '^='
     && lk != 206341                // True '++' '^='
     && lk != 206342                // False '++' '^='
     && lk != 206343                // Character '++' '^='
     && lk != 206344                // String '++' '^='
     && lk != 206345                // Real '++' '^='
     && lk != 206595                // Identifier '--' '^='
     && lk != 206596                // Null '--' '^='
     && lk != 206597                // True '--' '^='
     && lk != 206598                // False '--' '^='
     && lk != 206599                // Character '--' '^='
     && lk != 206600                // String '--' '^='
     && lk != 206601                // Real '--' '^='
     && lk != 207919                // '[' ']' '^='
     && lk != 210435                // Identifier '++' 'char'
     && lk != 210436                // Null '++' 'char'
     && lk != 210437                // True '++' 'char'
     && lk != 210438                // False '++' 'char'
     && lk != 210439                // Character '++' 'char'
     && lk != 210440                // String '++' 'char'
     && lk != 210441                // Real '++' 'char'
     && lk != 210691                // Identifier '--' 'char'
     && lk != 210692                // Null '--' 'char'
     && lk != 210693                // True '--' 'char'
     && lk != 210694                // False '--' 'char'
     && lk != 210695                // Character '--' 'char'
     && lk != 210696                // String '--' 'char'
     && lk != 210697                // Real '--' 'char'
     && lk != 212015                // '[' ']' 'char'
     && lk != 214531                // Identifier '++' 'double'
     && lk != 214532                // Null '++' 'double'
     && lk != 214533                // True '++' 'double'
     && lk != 214534                // False '++' 'double'
     && lk != 214535                // Character '++' 'double'
     && lk != 214536                // String '++' 'double'
     && lk != 214537                // Real '++' 'double'
     && lk != 214787                // Identifier '--' 'double'
     && lk != 214788                // Null '--' 'double'
     && lk != 214789                // True '--' 'double'
     && lk != 214790                // False '--' 'double'
     && lk != 214791                // Character '--' 'double'
     && lk != 214792                // String '--' 'double'
     && lk != 214793                // Real '--' 'double'
     && lk != 216111                // '[' ']' 'double'
     && lk != 218627                // Identifier '++' 'float'
     && lk != 218628                // Null '++' 'float'
     && lk != 218629                // True '++' 'float'
     && lk != 218630                // False '++' 'float'
     && lk != 218631                // Character '++' 'float'
     && lk != 218632                // String '++' 'float'
     && lk != 218633                // Real '++' 'float'
     && lk != 218883                // Identifier '--' 'float'
     && lk != 218884                // Null '--' 'float'
     && lk != 218885                // True '--' 'float'
     && lk != 218886                // False '--' 'float'
     && lk != 218887                // Character '--' 'float'
     && lk != 218888                // String '--' 'float'
     && lk != 218889                // Real '--' 'float'
     && lk != 220207                // '[' ']' 'float'
     && lk != 222723                // Identifier '++' 'int'
     && lk != 222724                // Null '++' 'int'
     && lk != 222725                // True '++' 'int'
     && lk != 222726                // False '++' 'int'
     && lk != 222727                // Character '++' 'int'
     && lk != 222728                // String '++' 'int'
     && lk != 222729                // Real '++' 'int'
     && lk != 222979                // Identifier '--' 'int'
     && lk != 222980                // Null '--' 'int'
     && lk != 222981                // True '--' 'int'
     && lk != 222982                // False '--' 'int'
     && lk != 222983                // Character '--' 'int'
     && lk != 222984                // String '--' 'int'
     && lk != 222985                // Real '--' 'int'
     && lk != 224303                // '[' ']' 'int'
     && lk != 226819                // Identifier '++' 'long'
     && lk != 226820                // Null '++' 'long'
     && lk != 226821                // True '++' 'long'
     && lk != 226822                // False '++' 'long'
     && lk != 226823                // Character '++' 'long'
     && lk != 226824                // String '++' 'long'
     && lk != 226825                // Real '++' 'long'
     && lk != 227075                // Identifier '--' 'long'
     && lk != 227076                // Null '--' 'long'
     && lk != 227077                // True '--' 'long'
     && lk != 227078                // False '--' 'long'
     && lk != 227079                // Character '--' 'long'
     && lk != 227080                // String '--' 'long'
     && lk != 227081                // Real '--' 'long'
     && lk != 228399                // '[' ']' 'long'
     && lk != 232495                // '[' ']' '{'
     && lk != 235011                // Identifier '++' '|'
     && lk != 235012                // Null '++' '|'
     && lk != 235013                // True '++' '|'
     && lk != 235014                // False '++' '|'
     && lk != 235015                // Character '++' '|'
     && lk != 235016                // String '++' '|'
     && lk != 235017                // Real '++' '|'
     && lk != 235267                // Identifier '--' '|'
     && lk != 235268                // Null '--' '|'
     && lk != 235269                // True '--' '|'
     && lk != 235270                // False '--' '|'
     && lk != 235271                // Character '--' '|'
     && lk != 235272                // String '--' '|'
     && lk != 235273                // Real '--' '|'
     && lk != 236591                // '[' ']' '|'
     && lk != 239107                // Identifier '++' '|='
     && lk != 239108                // Null '++' '|='
     && lk != 239109                // True '++' '|='
     && lk != 239110                // False '++' '|='
     && lk != 239111                // Character '++' '|='
     && lk != 239112                // String '++' '|='
     && lk != 239113                // Real '++' '|='
     && lk != 239363                // Identifier '--' '|='
     && lk != 239364                // Null '--' '|='
     && lk != 239365                // True '--' '|='
     && lk != 239366                // False '--' '|='
     && lk != 239367                // Character '--' '|='
     && lk != 239368                // String '--' '|='
     && lk != 239369                // Real '--' '|='
     && lk != 240687                // '[' ']' '|='
     && lk != 243203                // Identifier '++' '||'
     && lk != 243204                // Null '++' '||'
     && lk != 243205                // True '++' '||'
     && lk != 243206                // False '++' '||'
     && lk != 243207                // Character '++' '||'
     && lk != 243208                // String '++' '||'
     && lk != 243209                // Real '++' '||'
     && lk != 243459                // Identifier '--' '||'
     && lk != 243460                // Null '--' '||'
     && lk != 243461                // True '--' '||'
     && lk != 243462                // False '--' '||'
     && lk != 243463                // Character '--' '||'
     && lk != 243464                // String '--' '||'
     && lk != 243465                // Real '--' '||'
     && lk != 244783                // '[' ']' '||'
     && lk != 247299                // Identifier '++' '}'
     && lk != 247300                // Null '++' '}'
     && lk != 247301                // True '++' '}'
     && lk != 247302                // False '++' '}'
     && lk != 247303                // Character '++' '}'
     && lk != 247304                // String '++' '}'
     && lk != 247305                // Real '++' '}'
     && lk != 247555                // Identifier '--' '}'
     && lk != 247556                // Null '--' '}'
     && lk != 247557                // True '--' '}'
     && lk != 247558                // False '--' '}'
     && lk != 247559                // Character '--' '}'
     && lk != 247560                // String '--' '}'
     && lk != 247561                // Real '--' '}'
     && lk != 248879                // '[' ']' '}'
     && lk != 251395                // Identifier '++' '~'
     && lk != 251396                // Null '++' '~'
     && lk != 251397                // True '++' '~'
     && lk != 251398                // False '++' '~'
     && lk != 251399                // Character '++' '~'
     && lk != 251400                // String '++' '~'
     && lk != 251401                // Real '++' '~'
     && lk != 251651                // Identifier '--' '~'
     && lk != 251652                // Null '--' '~'
     && lk != 251653                // True '--' '~'
     && lk != 251654                // False '--' '~'
     && lk != 251655                // Character '--' '~'
     && lk != 251656                // String '--' '~'
     && lk != 251657                // Real '--' '~'
     && lk != 252975)               // '[' ']' '~'
    {
      lk = memoized(2, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          try_Primary();
          lookahead1W(2);           // WhiteSpace^token | '++'
          consumeT(24);             // '++'
          memoize(2, e0A, -5);
          lk = -8;
        }
        catch (p5A)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            try_Primary();
            lookahead1W(3);         // WhiteSpace^token | '--'
            consumeT(28);           // '--'
            memoize(2, e0A, -6);
            lk = -8;
          }
          catch (p6A)
          {
            lk = -7;
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            memoize(2, e0A, -7);
          }
        }
      }
    }
    switch (lk)
    {
    case 61:                        // '~'
      consumeT(61);                 // '~'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      try_Primary();
      break;
    case 12:                        // '!'
      consumeT(12);                 // '!'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      try_Primary();
      break;
    case 24:                        // '++'
      consumeT(24);                 // '++'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      try_Primary();
      break;
    case 28:                        // '--'
      consumeT(28);                 // '--'
      lookahead1W(8);               // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
      try_Primary();
      break;
    case -5:
    case 5635:                      // Identifier '++' END
    case 5636:                      // Null '++' END
    case 5637:                      // True '++' END
    case 5638:                      // False '++' END
    case 5639:                      // Character '++' END
    case 5640:                      // String '++' END
    case 5641:                      // Real '++' END
    case 42499:                     // Identifier '++' Comment
    case 42500:                     // Null '++' Comment
    case 42501:                     // True '++' Comment
    case 42502:                     // False '++' Comment
    case 42503:                     // Character '++' Comment
    case 42504:                     // String '++' Comment
    case 42505:                     // Real '++' Comment
    case 50691:                     // Identifier '++' '!'
    case 50692:                     // Null '++' '!'
    case 50693:                     // True '++' '!'
    case 50694:                     // False '++' '!'
    case 50695:                     // Character '++' '!'
    case 50696:                     // String '++' '!'
    case 50697:                     // Real '++' '!'
    case 54787:                     // Identifier '++' '!='
    case 54788:                     // Null '++' '!='
    case 54789:                     // True '++' '!='
    case 54790:                     // False '++' '!='
    case 54791:                     // Character '++' '!='
    case 54792:                     // String '++' '!='
    case 54793:                     // Real '++' '!='
    case 58883:                     // Identifier '++' '%'
    case 58884:                     // Null '++' '%'
    case 58885:                     // True '++' '%'
    case 58886:                     // False '++' '%'
    case 58887:                     // Character '++' '%'
    case 58888:                     // String '++' '%'
    case 58889:                     // Real '++' '%'
    case 62979:                     // Identifier '++' '%='
    case 62980:                     // Null '++' '%='
    case 62981:                     // True '++' '%='
    case 62982:                     // False '++' '%='
    case 62983:                     // Character '++' '%='
    case 62984:                     // String '++' '%='
    case 62985:                     // Real '++' '%='
    case 67075:                     // Identifier '++' '&'
    case 67076:                     // Null '++' '&'
    case 67077:                     // True '++' '&'
    case 67078:                     // False '++' '&'
    case 67079:                     // Character '++' '&'
    case 67080:                     // String '++' '&'
    case 67081:                     // Real '++' '&'
    case 71171:                     // Identifier '++' '&&'
    case 71172:                     // Null '++' '&&'
    case 71173:                     // True '++' '&&'
    case 71174:                     // False '++' '&&'
    case 71175:                     // Character '++' '&&'
    case 71176:                     // String '++' '&&'
    case 71177:                     // Real '++' '&&'
    case 75267:                     // Identifier '++' '&='
    case 75268:                     // Null '++' '&='
    case 75269:                     // True '++' '&='
    case 75270:                     // False '++' '&='
    case 75271:                     // Character '++' '&='
    case 75272:                     // String '++' '&='
    case 75273:                     // Real '++' '&='
    case 83459:                     // Identifier '++' ')'
    case 83460:                     // Null '++' ')'
    case 83461:                     // True '++' ')'
    case 83462:                     // False '++' ')'
    case 83463:                     // Character '++' ')'
    case 83464:                     // String '++' ')'
    case 83465:                     // Real '++' ')'
    case 87555:                     // Identifier '++' '*'
    case 87556:                     // Null '++' '*'
    case 87557:                     // True '++' '*'
    case 87558:                     // False '++' '*'
    case 87559:                     // Character '++' '*'
    case 87560:                     // String '++' '*'
    case 87561:                     // Real '++' '*'
    case 91651:                     // Identifier '++' '*='
    case 91652:                     // Null '++' '*='
    case 91653:                     // True '++' '*='
    case 91654:                     // False '++' '*='
    case 91655:                     // Character '++' '*='
    case 91656:                     // String '++' '*='
    case 91657:                     // Real '++' '*='
    case 95747:                     // Identifier '++' '+'
    case 95748:                     // Null '++' '+'
    case 95749:                     // True '++' '+'
    case 95750:                     // False '++' '+'
    case 95751:                     // Character '++' '+'
    case 95752:                     // String '++' '+'
    case 95753:                     // Real '++' '+'
    case 99843:                     // Identifier '++' '++'
    case 99844:                     // Null '++' '++'
    case 99845:                     // True '++' '++'
    case 99846:                     // False '++' '++'
    case 99847:                     // Character '++' '++'
    case 99848:                     // String '++' '++'
    case 99849:                     // Real '++' '++'
    case 103939:                    // Identifier '++' '+='
    case 103940:                    // Null '++' '+='
    case 103941:                    // True '++' '+='
    case 103942:                    // False '++' '+='
    case 103943:                    // Character '++' '+='
    case 103944:                    // String '++' '+='
    case 103945:                    // Real '++' '+='
    case 108035:                    // Identifier '++' ','
    case 108036:                    // Null '++' ','
    case 108037:                    // True '++' ','
    case 108038:                    // False '++' ','
    case 108039:                    // Character '++' ','
    case 108040:                    // String '++' ','
    case 108041:                    // Real '++' ','
    case 112131:                    // Identifier '++' '-'
    case 112132:                    // Null '++' '-'
    case 112133:                    // True '++' '-'
    case 112134:                    // False '++' '-'
    case 112135:                    // Character '++' '-'
    case 112136:                    // String '++' '-'
    case 112137:                    // Real '++' '-'
    case 116227:                    // Identifier '++' '--'
    case 116228:                    // Null '++' '--'
    case 116229:                    // True '++' '--'
    case 116230:                    // False '++' '--'
    case 116231:                    // Character '++' '--'
    case 116232:                    // String '++' '--'
    case 116233:                    // Real '++' '--'
    case 120323:                    // Identifier '++' '-='
    case 120324:                    // Null '++' '-='
    case 120325:                    // True '++' '-='
    case 120326:                    // False '++' '-='
    case 120327:                    // Character '++' '-='
    case 120328:                    // String '++' '-='
    case 120329:                    // Real '++' '-='
    case 132611:                    // Identifier '++' '/'
    case 132612:                    // Null '++' '/'
    case 132613:                    // True '++' '/'
    case 132614:                    // False '++' '/'
    case 132615:                    // Character '++' '/'
    case 132616:                    // String '++' '/'
    case 132617:                    // Real '++' '/'
    case 136707:                    // Identifier '++' '/='
    case 136708:                    // Null '++' '/='
    case 136709:                    // True '++' '/='
    case 136710:                    // False '++' '/='
    case 136711:                    // Character '++' '/='
    case 136712:                    // String '++' '/='
    case 136713:                    // Real '++' '/='
    case 140803:                    // Identifier '++' ':'
    case 140804:                    // Null '++' ':'
    case 140805:                    // True '++' ':'
    case 140806:                    // False '++' ':'
    case 140807:                    // Character '++' ':'
    case 140808:                    // String '++' ':'
    case 140809:                    // Real '++' ':'
    case 144899:                    // Identifier '++' ';'
    case 144900:                    // Null '++' ';'
    case 144901:                    // True '++' ';'
    case 144902:                    // False '++' ';'
    case 144903:                    // Character '++' ';'
    case 144904:                    // String '++' ';'
    case 144905:                    // Real '++' ';'
    case 148995:                    // Identifier '++' '<'
    case 148996:                    // Null '++' '<'
    case 148997:                    // True '++' '<'
    case 148998:                    // False '++' '<'
    case 148999:                    // Character '++' '<'
    case 149000:                    // String '++' '<'
    case 149001:                    // Real '++' '<'
    case 153091:                    // Identifier '++' '<<'
    case 153092:                    // Null '++' '<<'
    case 153093:                    // True '++' '<<'
    case 153094:                    // False '++' '<<'
    case 153095:                    // Character '++' '<<'
    case 153096:                    // String '++' '<<'
    case 153097:                    // Real '++' '<<'
    case 157187:                    // Identifier '++' '<<='
    case 157188:                    // Null '++' '<<='
    case 157189:                    // True '++' '<<='
    case 157190:                    // False '++' '<<='
    case 157191:                    // Character '++' '<<='
    case 157192:                    // String '++' '<<='
    case 157193:                    // Real '++' '<<='
    case 161283:                    // Identifier '++' '<='
    case 161284:                    // Null '++' '<='
    case 161285:                    // True '++' '<='
    case 161286:                    // False '++' '<='
    case 161287:                    // Character '++' '<='
    case 161288:                    // String '++' '<='
    case 161289:                    // Real '++' '<='
    case 165379:                    // Identifier '++' '='
    case 165380:                    // Null '++' '='
    case 165381:                    // True '++' '='
    case 165382:                    // False '++' '='
    case 165383:                    // Character '++' '='
    case 165384:                    // String '++' '='
    case 165385:                    // Real '++' '='
    case 169475:                    // Identifier '++' '=='
    case 169476:                    // Null '++' '=='
    case 169477:                    // True '++' '=='
    case 169478:                    // False '++' '=='
    case 169479:                    // Character '++' '=='
    case 169480:                    // String '++' '=='
    case 169481:                    // Real '++' '=='
    case 173571:                    // Identifier '++' '>'
    case 173572:                    // Null '++' '>'
    case 173573:                    // True '++' '>'
    case 173574:                    // False '++' '>'
    case 173575:                    // Character '++' '>'
    case 173576:                    // String '++' '>'
    case 173577:                    // Real '++' '>'
    case 177667:                    // Identifier '++' '>='
    case 177668:                    // Null '++' '>='
    case 177669:                    // True '++' '>='
    case 177670:                    // False '++' '>='
    case 177671:                    // Character '++' '>='
    case 177672:                    // String '++' '>='
    case 177673:                    // Real '++' '>='
    case 181763:                    // Identifier '++' '>>'
    case 181764:                    // Null '++' '>>'
    case 181765:                    // True '++' '>>'
    case 181766:                    // False '++' '>>'
    case 181767:                    // Character '++' '>>'
    case 181768:                    // String '++' '>>'
    case 181769:                    // Real '++' '>>'
    case 185859:                    // Identifier '++' '>>='
    case 185860:                    // Null '++' '>>='
    case 185861:                    // True '++' '>>='
    case 185862:                    // False '++' '>>='
    case 185863:                    // Character '++' '>>='
    case 185864:                    // String '++' '>>='
    case 185865:                    // Real '++' '>>='
    case 189955:                    // Identifier '++' '?'
    case 189956:                    // Null '++' '?'
    case 189957:                    // True '++' '?'
    case 189958:                    // False '++' '?'
    case 189959:                    // Character '++' '?'
    case 189960:                    // String '++' '?'
    case 189961:                    // Real '++' '?'
    case 198147:                    // Identifier '++' ']'
    case 198148:                    // Null '++' ']'
    case 198149:                    // True '++' ']'
    case 198150:                    // False '++' ']'
    case 198151:                    // Character '++' ']'
    case 198152:                    // String '++' ']'
    case 198153:                    // Real '++' ']'
    case 202243:                    // Identifier '++' '^'
    case 202244:                    // Null '++' '^'
    case 202245:                    // True '++' '^'
    case 202246:                    // False '++' '^'
    case 202247:                    // Character '++' '^'
    case 202248:                    // String '++' '^'
    case 202249:                    // Real '++' '^'
    case 206339:                    // Identifier '++' '^='
    case 206340:                    // Null '++' '^='
    case 206341:                    // True '++' '^='
    case 206342:                    // False '++' '^='
    case 206343:                    // Character '++' '^='
    case 206344:                    // String '++' '^='
    case 206345:                    // Real '++' '^='
    case 210435:                    // Identifier '++' 'char'
    case 210436:                    // Null '++' 'char'
    case 210437:                    // True '++' 'char'
    case 210438:                    // False '++' 'char'
    case 210439:                    // Character '++' 'char'
    case 210440:                    // String '++' 'char'
    case 210441:                    // Real '++' 'char'
    case 214531:                    // Identifier '++' 'double'
    case 214532:                    // Null '++' 'double'
    case 214533:                    // True '++' 'double'
    case 214534:                    // False '++' 'double'
    case 214535:                    // Character '++' 'double'
    case 214536:                    // String '++' 'double'
    case 214537:                    // Real '++' 'double'
    case 218627:                    // Identifier '++' 'float'
    case 218628:                    // Null '++' 'float'
    case 218629:                    // True '++' 'float'
    case 218630:                    // False '++' 'float'
    case 218631:                    // Character '++' 'float'
    case 218632:                    // String '++' 'float'
    case 218633:                    // Real '++' 'float'
    case 222723:                    // Identifier '++' 'int'
    case 222724:                    // Null '++' 'int'
    case 222725:                    // True '++' 'int'
    case 222726:                    // False '++' 'int'
    case 222727:                    // Character '++' 'int'
    case 222728:                    // String '++' 'int'
    case 222729:                    // Real '++' 'int'
    case 226819:                    // Identifier '++' 'long'
    case 226820:                    // Null '++' 'long'
    case 226821:                    // True '++' 'long'
    case 226822:                    // False '++' 'long'
    case 226823:                    // Character '++' 'long'
    case 226824:                    // String '++' 'long'
    case 226825:                    // Real '++' 'long'
    case 235011:                    // Identifier '++' '|'
    case 235012:                    // Null '++' '|'
    case 235013:                    // True '++' '|'
    case 235014:                    // False '++' '|'
    case 235015:                    // Character '++' '|'
    case 235016:                    // String '++' '|'
    case 235017:                    // Real '++' '|'
    case 239107:                    // Identifier '++' '|='
    case 239108:                    // Null '++' '|='
    case 239109:                    // True '++' '|='
    case 239110:                    // False '++' '|='
    case 239111:                    // Character '++' '|='
    case 239112:                    // String '++' '|='
    case 239113:                    // Real '++' '|='
    case 243203:                    // Identifier '++' '||'
    case 243204:                    // Null '++' '||'
    case 243205:                    // True '++' '||'
    case 243206:                    // False '++' '||'
    case 243207:                    // Character '++' '||'
    case 243208:                    // String '++' '||'
    case 243209:                    // Real '++' '||'
    case 247299:                    // Identifier '++' '}'
    case 247300:                    // Null '++' '}'
    case 247301:                    // True '++' '}'
    case 247302:                    // False '++' '}'
    case 247303:                    // Character '++' '}'
    case 247304:                    // String '++' '}'
    case 247305:                    // Real '++' '}'
    case 251395:                    // Identifier '++' '~'
    case 251396:                    // Null '++' '~'
    case 251397:                    // True '++' '~'
    case 251398:                    // False '++' '~'
    case 251399:                    // Character '++' '~'
    case 251400:                    // String '++' '~'
    case 251401:                    // Real '++' '~'
      try_Primary();
      lookahead1W(2);               // WhiteSpace^token | '++'
      consumeT(24);                 // '++'
      break;
    case -6:
    case 5891:                      // Identifier '--' END
    case 5892:                      // Null '--' END
    case 5893:                      // True '--' END
    case 5894:                      // False '--' END
    case 5895:                      // Character '--' END
    case 5896:                      // String '--' END
    case 5897:                      // Real '--' END
    case 42755:                     // Identifier '--' Comment
    case 42756:                     // Null '--' Comment
    case 42757:                     // True '--' Comment
    case 42758:                     // False '--' Comment
    case 42759:                     // Character '--' Comment
    case 42760:                     // String '--' Comment
    case 42761:                     // Real '--' Comment
    case 50947:                     // Identifier '--' '!'
    case 50948:                     // Null '--' '!'
    case 50949:                     // True '--' '!'
    case 50950:                     // False '--' '!'
    case 50951:                     // Character '--' '!'
    case 50952:                     // String '--' '!'
    case 50953:                     // Real '--' '!'
    case 55043:                     // Identifier '--' '!='
    case 55044:                     // Null '--' '!='
    case 55045:                     // True '--' '!='
    case 55046:                     // False '--' '!='
    case 55047:                     // Character '--' '!='
    case 55048:                     // String '--' '!='
    case 55049:                     // Real '--' '!='
    case 59139:                     // Identifier '--' '%'
    case 59140:                     // Null '--' '%'
    case 59141:                     // True '--' '%'
    case 59142:                     // False '--' '%'
    case 59143:                     // Character '--' '%'
    case 59144:                     // String '--' '%'
    case 59145:                     // Real '--' '%'
    case 63235:                     // Identifier '--' '%='
    case 63236:                     // Null '--' '%='
    case 63237:                     // True '--' '%='
    case 63238:                     // False '--' '%='
    case 63239:                     // Character '--' '%='
    case 63240:                     // String '--' '%='
    case 63241:                     // Real '--' '%='
    case 67331:                     // Identifier '--' '&'
    case 67332:                     // Null '--' '&'
    case 67333:                     // True '--' '&'
    case 67334:                     // False '--' '&'
    case 67335:                     // Character '--' '&'
    case 67336:                     // String '--' '&'
    case 67337:                     // Real '--' '&'
    case 71427:                     // Identifier '--' '&&'
    case 71428:                     // Null '--' '&&'
    case 71429:                     // True '--' '&&'
    case 71430:                     // False '--' '&&'
    case 71431:                     // Character '--' '&&'
    case 71432:                     // String '--' '&&'
    case 71433:                     // Real '--' '&&'
    case 75523:                     // Identifier '--' '&='
    case 75524:                     // Null '--' '&='
    case 75525:                     // True '--' '&='
    case 75526:                     // False '--' '&='
    case 75527:                     // Character '--' '&='
    case 75528:                     // String '--' '&='
    case 75529:                     // Real '--' '&='
    case 83715:                     // Identifier '--' ')'
    case 83716:                     // Null '--' ')'
    case 83717:                     // True '--' ')'
    case 83718:                     // False '--' ')'
    case 83719:                     // Character '--' ')'
    case 83720:                     // String '--' ')'
    case 83721:                     // Real '--' ')'
    case 87811:                     // Identifier '--' '*'
    case 87812:                     // Null '--' '*'
    case 87813:                     // True '--' '*'
    case 87814:                     // False '--' '*'
    case 87815:                     // Character '--' '*'
    case 87816:                     // String '--' '*'
    case 87817:                     // Real '--' '*'
    case 91907:                     // Identifier '--' '*='
    case 91908:                     // Null '--' '*='
    case 91909:                     // True '--' '*='
    case 91910:                     // False '--' '*='
    case 91911:                     // Character '--' '*='
    case 91912:                     // String '--' '*='
    case 91913:                     // Real '--' '*='
    case 96003:                     // Identifier '--' '+'
    case 96004:                     // Null '--' '+'
    case 96005:                     // True '--' '+'
    case 96006:                     // False '--' '+'
    case 96007:                     // Character '--' '+'
    case 96008:                     // String '--' '+'
    case 96009:                     // Real '--' '+'
    case 100099:                    // Identifier '--' '++'
    case 100100:                    // Null '--' '++'
    case 100101:                    // True '--' '++'
    case 100102:                    // False '--' '++'
    case 100103:                    // Character '--' '++'
    case 100104:                    // String '--' '++'
    case 100105:                    // Real '--' '++'
    case 104195:                    // Identifier '--' '+='
    case 104196:                    // Null '--' '+='
    case 104197:                    // True '--' '+='
    case 104198:                    // False '--' '+='
    case 104199:                    // Character '--' '+='
    case 104200:                    // String '--' '+='
    case 104201:                    // Real '--' '+='
    case 108291:                    // Identifier '--' ','
    case 108292:                    // Null '--' ','
    case 108293:                    // True '--' ','
    case 108294:                    // False '--' ','
    case 108295:                    // Character '--' ','
    case 108296:                    // String '--' ','
    case 108297:                    // Real '--' ','
    case 112387:                    // Identifier '--' '-'
    case 112388:                    // Null '--' '-'
    case 112389:                    // True '--' '-'
    case 112390:                    // False '--' '-'
    case 112391:                    // Character '--' '-'
    case 112392:                    // String '--' '-'
    case 112393:                    // Real '--' '-'
    case 116483:                    // Identifier '--' '--'
    case 116484:                    // Null '--' '--'
    case 116485:                    // True '--' '--'
    case 116486:                    // False '--' '--'
    case 116487:                    // Character '--' '--'
    case 116488:                    // String '--' '--'
    case 116489:                    // Real '--' '--'
    case 120579:                    // Identifier '--' '-='
    case 120580:                    // Null '--' '-='
    case 120581:                    // True '--' '-='
    case 120582:                    // False '--' '-='
    case 120583:                    // Character '--' '-='
    case 120584:                    // String '--' '-='
    case 120585:                    // Real '--' '-='
    case 132867:                    // Identifier '--' '/'
    case 132868:                    // Null '--' '/'
    case 132869:                    // True '--' '/'
    case 132870:                    // False '--' '/'
    case 132871:                    // Character '--' '/'
    case 132872:                    // String '--' '/'
    case 132873:                    // Real '--' '/'
    case 136963:                    // Identifier '--' '/='
    case 136964:                    // Null '--' '/='
    case 136965:                    // True '--' '/='
    case 136966:                    // False '--' '/='
    case 136967:                    // Character '--' '/='
    case 136968:                    // String '--' '/='
    case 136969:                    // Real '--' '/='
    case 141059:                    // Identifier '--' ':'
    case 141060:                    // Null '--' ':'
    case 141061:                    // True '--' ':'
    case 141062:                    // False '--' ':'
    case 141063:                    // Character '--' ':'
    case 141064:                    // String '--' ':'
    case 141065:                    // Real '--' ':'
    case 145155:                    // Identifier '--' ';'
    case 145156:                    // Null '--' ';'
    case 145157:                    // True '--' ';'
    case 145158:                    // False '--' ';'
    case 145159:                    // Character '--' ';'
    case 145160:                    // String '--' ';'
    case 145161:                    // Real '--' ';'
    case 149251:                    // Identifier '--' '<'
    case 149252:                    // Null '--' '<'
    case 149253:                    // True '--' '<'
    case 149254:                    // False '--' '<'
    case 149255:                    // Character '--' '<'
    case 149256:                    // String '--' '<'
    case 149257:                    // Real '--' '<'
    case 153347:                    // Identifier '--' '<<'
    case 153348:                    // Null '--' '<<'
    case 153349:                    // True '--' '<<'
    case 153350:                    // False '--' '<<'
    case 153351:                    // Character '--' '<<'
    case 153352:                    // String '--' '<<'
    case 153353:                    // Real '--' '<<'
    case 157443:                    // Identifier '--' '<<='
    case 157444:                    // Null '--' '<<='
    case 157445:                    // True '--' '<<='
    case 157446:                    // False '--' '<<='
    case 157447:                    // Character '--' '<<='
    case 157448:                    // String '--' '<<='
    case 157449:                    // Real '--' '<<='
    case 161539:                    // Identifier '--' '<='
    case 161540:                    // Null '--' '<='
    case 161541:                    // True '--' '<='
    case 161542:                    // False '--' '<='
    case 161543:                    // Character '--' '<='
    case 161544:                    // String '--' '<='
    case 161545:                    // Real '--' '<='
    case 165635:                    // Identifier '--' '='
    case 165636:                    // Null '--' '='
    case 165637:                    // True '--' '='
    case 165638:                    // False '--' '='
    case 165639:                    // Character '--' '='
    case 165640:                    // String '--' '='
    case 165641:                    // Real '--' '='
    case 169731:                    // Identifier '--' '=='
    case 169732:                    // Null '--' '=='
    case 169733:                    // True '--' '=='
    case 169734:                    // False '--' '=='
    case 169735:                    // Character '--' '=='
    case 169736:                    // String '--' '=='
    case 169737:                    // Real '--' '=='
    case 173827:                    // Identifier '--' '>'
    case 173828:                    // Null '--' '>'
    case 173829:                    // True '--' '>'
    case 173830:                    // False '--' '>'
    case 173831:                    // Character '--' '>'
    case 173832:                    // String '--' '>'
    case 173833:                    // Real '--' '>'
    case 177923:                    // Identifier '--' '>='
    case 177924:                    // Null '--' '>='
    case 177925:                    // True '--' '>='
    case 177926:                    // False '--' '>='
    case 177927:                    // Character '--' '>='
    case 177928:                    // String '--' '>='
    case 177929:                    // Real '--' '>='
    case 182019:                    // Identifier '--' '>>'
    case 182020:                    // Null '--' '>>'
    case 182021:                    // True '--' '>>'
    case 182022:                    // False '--' '>>'
    case 182023:                    // Character '--' '>>'
    case 182024:                    // String '--' '>>'
    case 182025:                    // Real '--' '>>'
    case 186115:                    // Identifier '--' '>>='
    case 186116:                    // Null '--' '>>='
    case 186117:                    // True '--' '>>='
    case 186118:                    // False '--' '>>='
    case 186119:                    // Character '--' '>>='
    case 186120:                    // String '--' '>>='
    case 186121:                    // Real '--' '>>='
    case 190211:                    // Identifier '--' '?'
    case 190212:                    // Null '--' '?'
    case 190213:                    // True '--' '?'
    case 190214:                    // False '--' '?'
    case 190215:                    // Character '--' '?'
    case 190216:                    // String '--' '?'
    case 190217:                    // Real '--' '?'
    case 198403:                    // Identifier '--' ']'
    case 198404:                    // Null '--' ']'
    case 198405:                    // True '--' ']'
    case 198406:                    // False '--' ']'
    case 198407:                    // Character '--' ']'
    case 198408:                    // String '--' ']'
    case 198409:                    // Real '--' ']'
    case 202499:                    // Identifier '--' '^'
    case 202500:                    // Null '--' '^'
    case 202501:                    // True '--' '^'
    case 202502:                    // False '--' '^'
    case 202503:                    // Character '--' '^'
    case 202504:                    // String '--' '^'
    case 202505:                    // Real '--' '^'
    case 206595:                    // Identifier '--' '^='
    case 206596:                    // Null '--' '^='
    case 206597:                    // True '--' '^='
    case 206598:                    // False '--' '^='
    case 206599:                    // Character '--' '^='
    case 206600:                    // String '--' '^='
    case 206601:                    // Real '--' '^='
    case 210691:                    // Identifier '--' 'char'
    case 210692:                    // Null '--' 'char'
    case 210693:                    // True '--' 'char'
    case 210694:                    // False '--' 'char'
    case 210695:                    // Character '--' 'char'
    case 210696:                    // String '--' 'char'
    case 210697:                    // Real '--' 'char'
    case 214787:                    // Identifier '--' 'double'
    case 214788:                    // Null '--' 'double'
    case 214789:                    // True '--' 'double'
    case 214790:                    // False '--' 'double'
    case 214791:                    // Character '--' 'double'
    case 214792:                    // String '--' 'double'
    case 214793:                    // Real '--' 'double'
    case 218883:                    // Identifier '--' 'float'
    case 218884:                    // Null '--' 'float'
    case 218885:                    // True '--' 'float'
    case 218886:                    // False '--' 'float'
    case 218887:                    // Character '--' 'float'
    case 218888:                    // String '--' 'float'
    case 218889:                    // Real '--' 'float'
    case 222979:                    // Identifier '--' 'int'
    case 222980:                    // Null '--' 'int'
    case 222981:                    // True '--' 'int'
    case 222982:                    // False '--' 'int'
    case 222983:                    // Character '--' 'int'
    case 222984:                    // String '--' 'int'
    case 222985:                    // Real '--' 'int'
    case 227075:                    // Identifier '--' 'long'
    case 227076:                    // Null '--' 'long'
    case 227077:                    // True '--' 'long'
    case 227078:                    // False '--' 'long'
    case 227079:                    // Character '--' 'long'
    case 227080:                    // String '--' 'long'
    case 227081:                    // Real '--' 'long'
    case 235267:                    // Identifier '--' '|'
    case 235268:                    // Null '--' '|'
    case 235269:                    // True '--' '|'
    case 235270:                    // False '--' '|'
    case 235271:                    // Character '--' '|'
    case 235272:                    // String '--' '|'
    case 235273:                    // Real '--' '|'
    case 239363:                    // Identifier '--' '|='
    case 239364:                    // Null '--' '|='
    case 239365:                    // True '--' '|='
    case 239366:                    // False '--' '|='
    case 239367:                    // Character '--' '|='
    case 239368:                    // String '--' '|='
    case 239369:                    // Real '--' '|='
    case 243459:                    // Identifier '--' '||'
    case 243460:                    // Null '--' '||'
    case 243461:                    // True '--' '||'
    case 243462:                    // False '--' '||'
    case 243463:                    // Character '--' '||'
    case 243464:                    // String '--' '||'
    case 243465:                    // Real '--' '||'
    case 247555:                    // Identifier '--' '}'
    case 247556:                    // Null '--' '}'
    case 247557:                    // True '--' '}'
    case 247558:                    // False '--' '}'
    case 247559:                    // Character '--' '}'
    case 247560:                    // String '--' '}'
    case 247561:                    // Real '--' '}'
    case 251651:                    // Identifier '--' '~'
    case 251652:                    // Null '--' '~'
    case 251653:                    // True '--' '~'
    case 251654:                    // False '--' '~'
    case 251655:                    // Character '--' '~'
    case 251656:                    // String '--' '~'
    case 251657:                    // Real '--' '~'
      try_Primary();
      lookahead1W(3);               // WhiteSpace^token | '--'
      consumeT(28);                 // '--'
      break;
    case -8:
      break;
    default:
      try_Primary();
    }
  }

  function parse_Primary()
  {
    eventHandler.startNonterminal("Primary", e0);
    switch (l1)
    {
    case 3:                         // Identifier
      parse_Member();
      break;
    case 19:                        // '('
      parse_ParenthesizedExpression();
      break;
    default:
      parse_Value();
    }
    eventHandler.endNonterminal("Primary", e0);
  }

  function try_Primary()
  {
    switch (l1)
    {
    case 3:                         // Identifier
      try_Member();
      break;
    case 19:                        // '('
      try_ParenthesizedExpression();
      break;
    default:
      try_Value();
    }
  }

  function parse_Expression()
  {
    eventHandler.startNonterminal("Expression", e0);
    switch (l1)
    {
    case 10:                        // Comment
      consume(10);                  // Comment
      break;
    case 35:                        // ';'
    case 51:                        // 'char'
    case 52:                        // 'double'
    case 53:                        // 'float'
    case 54:                        // 'int'
    case 55:                        // 'long'
      parse_Statement();
      break;
    default:
      parse_Operation();
    }
    eventHandler.endNonterminal("Expression", e0);
  }

  function try_Expression()
  {
    switch (l1)
    {
    case 10:                        // Comment
      consumeT(10);                 // Comment
      break;
    case 35:                        // ';'
    case 51:                        // 'char'
    case 52:                        // 'double'
    case 53:                        // 'float'
    case 54:                        // 'int'
    case 55:                        // 'long'
      try_Statement();
      break;
    default:
      try_Operation();
    }
  }

  function parse_Statement()
  {
    eventHandler.startNonterminal("Statement", e0);
    switch (l1)
    {
    case 35:                        // ';'
      parse_EmptyStatement();
      break;
    default:
      parse_VariableDeclaration();
    }
    eventHandler.endNonterminal("Statement", e0);
  }

  function try_Statement()
  {
    switch (l1)
    {
    case 35:                        // ';'
      try_EmptyStatement();
      break;
    default:
      try_VariableDeclaration();
    }
  }

  function parse_VariableDeclaration()
  {
    eventHandler.startNonterminal("VariableDeclaration", e0);
    parse_Type();
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    whitespace();
    parse_Expression();
    eventHandler.endNonterminal("VariableDeclaration", e0);
  }

  function try_VariableDeclaration()
  {
    try_Type();
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    try_Expression();
  }

  function parse_EmptyStatement()
  {
    eventHandler.startNonterminal("EmptyStatement", e0);
    consume(35);                    // ';'
    eventHandler.endNonterminal("EmptyStatement", e0);
  }

  function try_EmptyStatement()
  {
    consumeT(35);                   // ';'
  }

  function parse_Type()
  {
    eventHandler.startNonterminal("Type", e0);
    switch (l1)
    {
    case 51:                        // 'char'
      consume(51);                  // 'char'
      break;
    case 54:                        // 'int'
      consume(54);                  // 'int'
      break;
    case 55:                        // 'long'
      consume(55);                  // 'long'
      break;
    case 53:                        // 'float'
      consume(53);                  // 'float'
      break;
    default:
      consume(52);                  // 'double'
    }
    eventHandler.endNonterminal("Type", e0);
  }

  function try_Type()
  {
    switch (l1)
    {
    case 51:                        // 'char'
      consumeT(51);                 // 'char'
      break;
    case 54:                        // 'int'
      consumeT(54);                 // 'int'
      break;
    case 55:                        // 'long'
      consumeT(55);                 // 'long'
      break;
    case 53:                        // 'float'
      consumeT(53);                 // 'float'
      break;
    default:
      consumeT(52);                 // 'double'
    }
  }

  function parse_Arguments()
  {
    eventHandler.startNonterminal("Arguments", e0);
    parse_Expression();
    for (;;)
    {
      lookahead1W(16);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | ',' | '--' | ';' | '[' | ']' |
                                    // 'char' | 'double' | 'float' | 'int' | 'long' | '{' | '~'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      whitespace();
      parse_Expression();
    }
    eventHandler.endNonterminal("Arguments", e0);
  }

  function try_Arguments()
  {
    try_Expression();
    for (;;)
    {
      lookahead1W(16);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | ',' | '--' | ';' | '[' | ']' |
                                    // 'char' | 'double' | 'float' | 'int' | 'long' | '{' | '~'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      try_Expression();
    }
  }

  function parse_Member()
  {
    eventHandler.startNonterminal("Member", e0);
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 1219:                    // Identifier '('
        lookahead3W(12);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 1923:                    // Identifier '->'
      case 1987:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 13507                 // Identifier '(' Identifier
     || lk == 14211                 // Identifier '->' Identifier
     || lk == 14275                 // Identifier '.' Identifier
     || lk == 17603                 // Identifier '(' Null
     || lk == 21699                 // Identifier '(' True
     || lk == 25795                 // Identifier '(' False
     || lk == 29891                 // Identifier '(' Character
     || lk == 33987                 // Identifier '(' String
     || lk == 38083                 // Identifier '(' Real
     || lk == 42179                 // Identifier '(' Comment
     || lk == 50371                 // Identifier '(' '!'
     || lk == 79043                 // Identifier '(' '('
     || lk == 99523                 // Identifier '(' '++'
     || lk == 115907                // Identifier '(' '--'
     || lk == 144579                // Identifier '(' ';'
     || lk == 193731                // Identifier '(' '['
     || lk == 210115                // Identifier '(' 'char'
     || lk == 214211                // Identifier '(' 'double'
     || lk == 218307                // Identifier '(' 'float'
     || lk == 222403                // Identifier '(' 'int'
     || lk == 226499                // Identifier '(' 'long'
     || lk == 230595                // Identifier '(' '{'
     || lk == 251075)               // Identifier '(' '~'
    {
      lk = memoized(3, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          consumeT(3);              // Identifier
          for (;;)
          {
            lookahead1W(6);         // WhiteSpace^token | '(' | '->' | '.'
            if (l1 == 19)           // '('
            {
              break;
            }
            switch (l1)
            {
            case 31:                // '.'
              consumeT(31);         // '.'
              break;
            default:
              consumeT(30);         // '->'
            }
            lookahead1W(0);         // Identifier | WhiteSpace^token
            consumeT(3);            // Identifier
          }
          consumeT(19);             // '('
          for (;;)
          {
            lookahead1W(12);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
            if (l1 == 20)           // ')'
            {
              break;
            }
            try_Arguments();
          }
          consumeT(20);             // ')'
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
        b3 = b3A; e3 = e3A; end = e3A; }}}
        memoize(3, e0, lk);
      }
    }
    switch (lk)
    {
    case -1:
    case 83139:                     // Identifier '(' ')'
      consume(3);                   // Identifier
      for (;;)
      {
        lookahead1W(6);             // WhiteSpace^token | '(' | '->' | '.'
        if (l1 == 19)               // '('
        {
          break;
        }
        switch (l1)
        {
        case 31:                    // '.'
          consume(31);              // '.'
          break;
        default:
          consume(30);              // '->'
        }
        lookahead1W(0);             // Identifier | WhiteSpace^token
        consume(3);                 // Identifier
      }
      consume(19);                  // '('
      for (;;)
      {
        lookahead1W(12);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        if (l1 == 20)               // ')'
        {
          break;
        }
        whitespace();
        parse_Arguments();
      }
      consume(20);                  // ')'
      break;
    default:
      consume(3);                   // Identifier
      for (;;)
      {
        lookahead1W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
        if (l1 != 30                // '->'
         && l1 != 31)               // '.'
        {
          break;
        }
        switch (l1)
        {
        case 31:                    // '.'
          consume(31);              // '.'
          break;
        default:
          consume(30);              // '->'
        }
        lookahead1W(0);             // Identifier | WhiteSpace^token
        consume(3);                 // Identifier
      }
      for (;;)
      {
        lookahead1W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        switch (l1)
        {
        case 47:                    // '['
          lookahead2W(13);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
          switch (lk)
          {
          case 239:                 // '[' Identifier
            lookahead3W(23);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
            break;
          case 687:                 // '[' Comment
            lookahead3W(7);         // WhiteSpace^token | ',' | ';' | ']'
            break;
          case 2287:                // '[' ';'
            lookahead3W(15);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
            break;
          case 3055:                // '[' '['
            lookahead3W(13);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
            break;
          case 815:                 // '[' '!'
          case 1583:                // '[' '++'
          case 1839:                // '[' '--'
          case 3951:                // '[' '~'
            lookahead3W(8);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
            break;
          case 303:                 // '[' Null
          case 367:                 // '[' True
          case 431:                 // '[' False
          case 495:                 // '[' Character
          case 559:                 // '[' String
          case 623:                 // '[' Real
            lookahead3W(20);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
            break;
          case 1263:                // '[' '('
          case 3311:                // '[' 'char'
          case 3375:                // '[' 'double'
          case 3439:                // '[' 'float'
          case 3503:                // '[' 'int'
          case 3567:                // '[' 'long'
          case 3631:                // '[' '{'
            lookahead3W(10);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
            break;
          }
          break;
        default:
          lk = l1;
        }
        if (lk != 1                 // END
         && lk != 3                 // Identifier
         && lk != 4                 // Null
         && lk != 5                 // True
         && lk != 6                 // False
         && lk != 7                 // Character
         && lk != 8                 // String
         && lk != 9                 // Real
         && lk != 10                // Comment
         && lk != 12                // '!'
         && lk != 13                // '!='
         && lk != 14                // '%'
         && lk != 15                // '%='
         && lk != 16                // '&'
         && lk != 17                // '&&'
         && lk != 18                // '&='
         && lk != 19                // '('
         && lk != 20                // ')'
         && lk != 21                // '*'
         && lk != 22                // '*='
         && lk != 23                // '+'
         && lk != 24                // '++'
         && lk != 25                // '+='
         && lk != 26                // ','
         && lk != 27                // '-'
         && lk != 28                // '--'
         && lk != 29                // '-='
         && lk != 32                // '/'
         && lk != 33                // '/='
         && lk != 34                // ':'
         && lk != 35                // ';'
         && lk != 36                // '<'
         && lk != 37                // '<<'
         && lk != 38                // '<<='
         && lk != 39                // '<='
         && lk != 40                // '='
         && lk != 41                // '=='
         && lk != 42                // '>'
         && lk != 43                // '>='
         && lk != 44                // '>>'
         && lk != 45                // '>>='
         && lk != 46                // '?'
         && lk != 48                // ']'
         && lk != 49                // '^'
         && lk != 50                // '^='
         && lk != 51                // 'char'
         && lk != 52                // 'double'
         && lk != 53                // 'float'
         && lk != 54                // 'int'
         && lk != 55                // 'long'
         && lk != 56                // '{'
         && lk != 57                // '|'
         && lk != 58                // '|='
         && lk != 59                // '||'
         && lk != 60                // '}'
         && lk != 61                // '~'
         && lk != 3119              // '[' ']'
         && lk != 14575             // '[' ';' Identifier
         && lk != 18671             // '[' ';' Null
         && lk != 22767             // '[' ';' True
         && lk != 26863             // '[' ';' False
         && lk != 30959             // '[' ';' Character
         && lk != 35055             // '[' ';' String
         && lk != 39151             // '[' ';' Real
         && lk != 43247             // '[' ';' Comment
         && lk != 51439             // '[' ';' '!'
         && lk != 80111             // '[' ';' '('
         && lk != 100591            // '[' ';' '++'
         && lk != 116975            // '[' ';' '--'
         && lk != 143599            // '[' Identifier ';'
         && lk != 143663            // '[' Null ';'
         && lk != 143727            // '[' True ';'
         && lk != 143791            // '[' False ';'
         && lk != 143855            // '[' Character ';'
         && lk != 143919            // '[' String ';'
         && lk != 143983            // '[' Real ';'
         && lk != 144047            // '[' Comment ';'
         && lk != 145647            // '[' ';' ';'
         && lk != 194799            // '[' ';' '['
         && lk != 211183            // '[' ';' 'char'
         && lk != 215279            // '[' ';' 'double'
         && lk != 219375            // '[' ';' 'float'
         && lk != 223471            // '[' ';' 'int'
         && lk != 227567            // '[' ';' 'long'
         && lk != 231663            // '[' ';' '{'
         && lk != 252143)           // '[' ';' '~'
        {
          lk = memoized(4, e0);
          if (lk == 0)
          {
            var b0B = b0; var e0B = e0; var l1B = l1;
            var b1B = b1; var e1B = e1; var l2B = l2;
            var b2B = b2; var e2B = e2; var l3B = l3;
            var b3B = b3; var e3B = e3;
            try
            {
              consumeT(47);         // '['
              lookahead1W(10);      // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
              try_Arguments();
              consumeT(48);         // ']'
              lk = -1;
            }
            catch (p1B)
            {
              lk = -2;
            }
            b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
            b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
            b2 = b2B; e2 = e2B; l3 = l3B; if (l3 == 0) {end = e2B;} else {
            b3 = b3B; e3 = e3B; end = e3B; }}}
            memoize(4, e0, lk);
          }
        }
        if (lk != -1)
        {
          break;
        }
        consume(47);                // '['
        lookahead1W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        whitespace();
        parse_Arguments();
        consume(48);                // ']'
      }
    }
    eventHandler.endNonterminal("Member", e0);
  }

  function try_Member()
  {
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 1219:                    // Identifier '('
        lookahead3W(12);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      case 1923:                    // Identifier '->'
      case 1987:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 13507                 // Identifier '(' Identifier
     || lk == 14211                 // Identifier '->' Identifier
     || lk == 14275                 // Identifier '.' Identifier
     || lk == 17603                 // Identifier '(' Null
     || lk == 21699                 // Identifier '(' True
     || lk == 25795                 // Identifier '(' False
     || lk == 29891                 // Identifier '(' Character
     || lk == 33987                 // Identifier '(' String
     || lk == 38083                 // Identifier '(' Real
     || lk == 42179                 // Identifier '(' Comment
     || lk == 50371                 // Identifier '(' '!'
     || lk == 79043                 // Identifier '(' '('
     || lk == 99523                 // Identifier '(' '++'
     || lk == 115907                // Identifier '(' '--'
     || lk == 144579                // Identifier '(' ';'
     || lk == 193731                // Identifier '(' '['
     || lk == 210115                // Identifier '(' 'char'
     || lk == 214211                // Identifier '(' 'double'
     || lk == 218307                // Identifier '(' 'float'
     || lk == 222403                // Identifier '(' 'int'
     || lk == 226499                // Identifier '(' 'long'
     || lk == 230595                // Identifier '(' '{'
     || lk == 251075)               // Identifier '(' '~'
    {
      lk = memoized(3, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          consumeT(3);              // Identifier
          for (;;)
          {
            lookahead1W(6);         // WhiteSpace^token | '(' | '->' | '.'
            if (l1 == 19)           // '('
            {
              break;
            }
            switch (l1)
            {
            case 31:                // '.'
              consumeT(31);         // '.'
              break;
            default:
              consumeT(30);         // '->'
            }
            lookahead1W(0);         // Identifier | WhiteSpace^token
            consumeT(3);            // Identifier
          }
          consumeT(19);             // '('
          for (;;)
          {
            lookahead1W(12);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
            if (l1 == 20)           // ')'
            {
              break;
            }
            try_Arguments();
          }
          consumeT(20);             // ')'
          memoize(3, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(3, e0A, -2);
        }
      }
    }
    switch (lk)
    {
    case -1:
    case 83139:                     // Identifier '(' ')'
      consumeT(3);                  // Identifier
      for (;;)
      {
        lookahead1W(6);             // WhiteSpace^token | '(' | '->' | '.'
        if (l1 == 19)               // '('
        {
          break;
        }
        switch (l1)
        {
        case 31:                    // '.'
          consumeT(31);             // '.'
          break;
        default:
          consumeT(30);             // '->'
        }
        lookahead1W(0);             // Identifier | WhiteSpace^token
        consumeT(3);                // Identifier
      }
      consumeT(19);                 // '('
      for (;;)
      {
        lookahead1W(12);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        if (l1 == 20)               // ')'
        {
          break;
        }
        try_Arguments();
      }
      consumeT(20);                 // ')'
      break;
    case -3:
      break;
    default:
      consumeT(3);                  // Identifier
      for (;;)
      {
        lookahead1W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | '{' | '|' | '|=' | '||' | '}' | '~'
        if (l1 != 30                // '->'
         && l1 != 31)               // '.'
        {
          break;
        }
        switch (l1)
        {
        case 31:                    // '.'
          consumeT(31);             // '.'
          break;
        default:
          consumeT(30);             // '->'
        }
        lookahead1W(0);             // Identifier | WhiteSpace^token
        consumeT(3);                // Identifier
      }
      for (;;)
      {
        lookahead1W(24);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'char' | 'double' | 'float' | 'int' | 'long' | '{' |
                                    // '|' | '|=' | '||' | '}' | '~'
        switch (l1)
        {
        case 47:                    // '['
          lookahead2W(13);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
          switch (lk)
          {
          case 239:                 // '[' Identifier
            lookahead3W(23);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
            break;
          case 687:                 // '[' Comment
            lookahead3W(7);         // WhiteSpace^token | ',' | ';' | ']'
            break;
          case 2287:                // '[' ';'
            lookahead3W(15);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
            break;
          case 3055:                // '[' '['
            lookahead3W(13);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
            break;
          case 815:                 // '[' '!'
          case 1583:                // '[' '++'
          case 1839:                // '[' '--'
          case 3951:                // '[' '~'
            lookahead3W(8);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
            break;
          case 303:                 // '[' Null
          case 367:                 // '[' True
          case 431:                 // '[' False
          case 495:                 // '[' Character
          case 559:                 // '[' String
          case 623:                 // '[' Real
            lookahead3W(20);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
            break;
          case 1263:                // '[' '('
          case 3311:                // '[' 'char'
          case 3375:                // '[' 'double'
          case 3439:                // '[' 'float'
          case 3503:                // '[' 'int'
          case 3567:                // '[' 'long'
          case 3631:                // '[' '{'
            lookahead3W(10);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
            break;
          }
          break;
        default:
          lk = l1;
        }
        if (lk != 1                 // END
         && lk != 3                 // Identifier
         && lk != 4                 // Null
         && lk != 5                 // True
         && lk != 6                 // False
         && lk != 7                 // Character
         && lk != 8                 // String
         && lk != 9                 // Real
         && lk != 10                // Comment
         && lk != 12                // '!'
         && lk != 13                // '!='
         && lk != 14                // '%'
         && lk != 15                // '%='
         && lk != 16                // '&'
         && lk != 17                // '&&'
         && lk != 18                // '&='
         && lk != 19                // '('
         && lk != 20                // ')'
         && lk != 21                // '*'
         && lk != 22                // '*='
         && lk != 23                // '+'
         && lk != 24                // '++'
         && lk != 25                // '+='
         && lk != 26                // ','
         && lk != 27                // '-'
         && lk != 28                // '--'
         && lk != 29                // '-='
         && lk != 32                // '/'
         && lk != 33                // '/='
         && lk != 34                // ':'
         && lk != 35                // ';'
         && lk != 36                // '<'
         && lk != 37                // '<<'
         && lk != 38                // '<<='
         && lk != 39                // '<='
         && lk != 40                // '='
         && lk != 41                // '=='
         && lk != 42                // '>'
         && lk != 43                // '>='
         && lk != 44                // '>>'
         && lk != 45                // '>>='
         && lk != 46                // '?'
         && lk != 48                // ']'
         && lk != 49                // '^'
         && lk != 50                // '^='
         && lk != 51                // 'char'
         && lk != 52                // 'double'
         && lk != 53                // 'float'
         && lk != 54                // 'int'
         && lk != 55                // 'long'
         && lk != 56                // '{'
         && lk != 57                // '|'
         && lk != 58                // '|='
         && lk != 59                // '||'
         && lk != 60                // '}'
         && lk != 61                // '~'
         && lk != 3119              // '[' ']'
         && lk != 14575             // '[' ';' Identifier
         && lk != 18671             // '[' ';' Null
         && lk != 22767             // '[' ';' True
         && lk != 26863             // '[' ';' False
         && lk != 30959             // '[' ';' Character
         && lk != 35055             // '[' ';' String
         && lk != 39151             // '[' ';' Real
         && lk != 43247             // '[' ';' Comment
         && lk != 51439             // '[' ';' '!'
         && lk != 80111             // '[' ';' '('
         && lk != 100591            // '[' ';' '++'
         && lk != 116975            // '[' ';' '--'
         && lk != 143599            // '[' Identifier ';'
         && lk != 143663            // '[' Null ';'
         && lk != 143727            // '[' True ';'
         && lk != 143791            // '[' False ';'
         && lk != 143855            // '[' Character ';'
         && lk != 143919            // '[' String ';'
         && lk != 143983            // '[' Real ';'
         && lk != 144047            // '[' Comment ';'
         && lk != 145647            // '[' ';' ';'
         && lk != 194799            // '[' ';' '['
         && lk != 211183            // '[' ';' 'char'
         && lk != 215279            // '[' ';' 'double'
         && lk != 219375            // '[' ';' 'float'
         && lk != 223471            // '[' ';' 'int'
         && lk != 227567            // '[' ';' 'long'
         && lk != 231663            // '[' ';' '{'
         && lk != 252143)           // '[' ';' '~'
        {
          lk = memoized(4, e0);
          if (lk == 0)
          {
            var b0B = b0; var e0B = e0; var l1B = l1;
            var b1B = b1; var e1B = e1; var l2B = l2;
            var b2B = b2; var e2B = e2; var l3B = l3;
            var b3B = b3; var e3B = e3;
            try
            {
              consumeT(47);         // '['
              lookahead1W(10);      // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
              try_Arguments();
              consumeT(48);         // ']'
              memoize(4, e0B, -1);
              continue;
            }
            catch (p1B)
            {
              b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
              b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
              b2 = b2B; e2 = e2B; l3 = l3B; if (l3 == 0) {end = e2B;} else {
              b3 = b3B; e3 = e3B; end = e3B; }}}
              memoize(4, e0B, -2);
              break;
            }
          }
        }
        if (lk != -1)
        {
          break;
        }
        consumeT(47);               // '['
        lookahead1W(10);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
        try_Arguments();
        consumeT(48);               // ']'
      }
    }
  }

  function parse_Array()
  {
    eventHandler.startNonterminal("Array", e0);
    consume(56);                    // '{'
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    whitespace();
    parse_Element();
    for (;;)
    {
      lookahead1W(5);               // WhiteSpace^token | ',' | '}'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      whitespace();
      parse_Element();
    }
    consume(60);                    // '}'
    eventHandler.endNonterminal("Array", e0);
  }

  function try_Array()
  {
    consumeT(56);                   // '{'
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    try_Element();
    for (;;)
    {
      lookahead1W(5);               // WhiteSpace^token | ',' | '}'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      try_Element();
    }
    consumeT(60);                   // '}'
  }

  function parse_Matrix()
  {
    eventHandler.startNonterminal("Matrix", e0);
    consume(47);                    // '['
    lookahead1W(13);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
    switch (l1)
    {
    case 35:                        // ';'
      lookahead2W(15);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 2275:                    // ';' ';'
        lookahead3W(15);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 145635)               // ';' ';' ';'
    {
      lk = memoized(5, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          try_Row();
          lk = -1;
        }
        catch (p1A)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
        b3 = b3A; e3 = e3A; end = e3A; }}}
        memoize(5, e0, lk);
      }
    }
    if (lk != -2
     && lk != 48                    // ']'
     && lk != 227                   // ';' Identifier
     && lk != 291                   // ';' Null
     && lk != 355                   // ';' True
     && lk != 419                   // ';' False
     && lk != 483                   // ';' Character
     && lk != 547                   // ';' String
     && lk != 611                   // ';' Real
     && lk != 675                   // ';' Comment
     && lk != 803                   // ';' '!'
     && lk != 1251                  // ';' '('
     && lk != 1571                  // ';' '++'
     && lk != 1827                  // ';' '--'
     && lk != 3043                  // ';' '['
     && lk != 3299                  // ';' 'char'
     && lk != 3363                  // ';' 'double'
     && lk != 3427                  // ';' 'float'
     && lk != 3491                  // ';' 'int'
     && lk != 3555                  // ';' 'long'
     && lk != 3619                  // ';' '{'
     && lk != 3939                  // ';' '~'
     && lk != 108771                // ';' ';' ','
     && lk != 198883)               // ';' ';' ']'
    {
      whitespace();
      parse_Row();
    }
    for (;;)
    {
      if (l1 != 35)                 // ';'
      {
        break;
      }
      consume(35);                  // ';'
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      whitespace();
      parse_Row();
    }
    consume(48);                    // ']'
    eventHandler.endNonterminal("Matrix", e0);
  }

  function try_Matrix()
  {
    consumeT(47);                   // '['
    lookahead1W(13);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
    switch (l1)
    {
    case 35:                        // ';'
      lookahead2W(15);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
      switch (lk)
      {
      case 2275:                    // ';' ';'
        lookahead3W(15);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | '{' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 145635)               // ';' ';' ';'
    {
      lk = memoized(5, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          try_Row();
          memoize(5, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(5, e0A, -2);
        }
        lk = -2;
      }
    }
    if (lk != -2
     && lk != 48                    // ']'
     && lk != 227                   // ';' Identifier
     && lk != 291                   // ';' Null
     && lk != 355                   // ';' True
     && lk != 419                   // ';' False
     && lk != 483                   // ';' Character
     && lk != 547                   // ';' String
     && lk != 611                   // ';' Real
     && lk != 675                   // ';' Comment
     && lk != 803                   // ';' '!'
     && lk != 1251                  // ';' '('
     && lk != 1571                  // ';' '++'
     && lk != 1827                  // ';' '--'
     && lk != 3043                  // ';' '['
     && lk != 3299                  // ';' 'char'
     && lk != 3363                  // ';' 'double'
     && lk != 3427                  // ';' 'float'
     && lk != 3491                  // ';' 'int'
     && lk != 3555                  // ';' 'long'
     && lk != 3619                  // ';' '{'
     && lk != 3939                  // ';' '~'
     && lk != 108771                // ';' ';' ','
     && lk != 198883)               // ';' ';' ']'
    {
      try_Row();
    }
    for (;;)
    {
      if (l1 != 35)                 // ';'
      {
        break;
      }
      consumeT(35);                 // ';'
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      try_Row();
    }
    consumeT(48);                   // ']'
  }

  function parse_Element()
  {
    eventHandler.startNonterminal("Element", e0);
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(22);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
      break;
    case 8:                         // String
      lookahead2W(19);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 2179                  // Identifier ':'
     || lk == 2184)                 // String ':'
    {
      whitespace();
      parse_Key();
      lookahead1W(4);               // WhiteSpace^token | ':'
      consume(34);                  // ':'
    }
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    whitespace();
    parse_Expression();
    eventHandler.endNonterminal("Element", e0);
  }

  function try_Element()
  {
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(22);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
      break;
    case 8:                         // String
      lookahead2W(19);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 2179                  // Identifier ':'
     || lk == 2184)                 // String ':'
    {
      try_Key();
      lookahead1W(4);               // WhiteSpace^token | ':'
      consumeT(34);                 // ':'
    }
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    try_Expression();
  }

  function parse_Key()
  {
    eventHandler.startNonterminal("Key", e0);
    switch (l1)
    {
    case 3:                         // Identifier
      consume(3);                   // Identifier
      break;
    default:
      consume(8);                   // String
    }
    eventHandler.endNonterminal("Key", e0);
  }

  function try_Key()
  {
    switch (l1)
    {
    case 3:                         // Identifier
      consumeT(3);                  // Identifier
      break;
    default:
      consumeT(8);                  // String
    }
  }

  function parse_Row()
  {
    eventHandler.startNonterminal("Row", e0);
    parse_Column();
    for (;;)
    {
      lookahead1W(7);               // WhiteSpace^token | ',' | ';' | ']'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      whitespace();
      parse_Column();
    }
    eventHandler.endNonterminal("Row", e0);
  }

  function try_Row()
  {
    try_Column();
    for (;;)
    {
      lookahead1W(7);               // WhiteSpace^token | ',' | ';' | ']'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(10);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
      try_Column();
    }
  }

  function parse_Column()
  {
    eventHandler.startNonterminal("Column", e0);
    parse_Expression();
    eventHandler.endNonterminal("Column", e0);
  }

  function try_Column()
  {
    try_Expression();
  }

  function parse_ParenthesizedExpression()
  {
    eventHandler.startNonterminal("ParenthesizedExpression", e0);
    consume(19);                    // '('
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    whitespace();
    parse_Expression();
    lookahead1W(1);                 // WhiteSpace^token | ')'
    consume(20);                    // ')'
    eventHandler.endNonterminal("ParenthesizedExpression", e0);
  }

  function try_ParenthesizedExpression()
  {
    consumeT(19);                   // '('
    lookahead1W(10);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | '{' | '~'
    try_Expression();
    lookahead1W(1);                 // WhiteSpace^token | ')'
    consumeT(20);                   // ')'
  }

  function parse_Value()
  {
    eventHandler.startNonterminal("Value", e0);
    switch (l1)
    {
    case 9:                         // Real
      consume(9);                   // Real
      break;
    case 7:                         // Character
      consume(7);                   // Character
      break;
    case 8:                         // String
      consume(8);                   // String
      break;
    case 56:                        // '{'
      parse_Array();
      break;
    case 47:                        // '['
      parse_Matrix();
      break;
    case 4:                         // Null
      consume(4);                   // Null
      break;
    case 5:                         // True
      consume(5);                   // True
      break;
    default:
      consume(6);                   // False
    }
    eventHandler.endNonterminal("Value", e0);
  }

  function try_Value()
  {
    switch (l1)
    {
    case 9:                         // Real
      consumeT(9);                  // Real
      break;
    case 7:                         // Character
      consumeT(7);                  // Character
      break;
    case 8:                         // String
      consumeT(8);                  // String
      break;
    case 56:                        // '{'
      try_Array();
      break;
    case 47:                        // '['
      try_Matrix();
      break;
    case 4:                         // Null
      consumeT(4);                  // Null
      break;
    case 5:                         // True
      consumeT(5);                  // True
      break;
    default:
      consumeT(6);                  // False
    }
  }

  function consume(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(operators.TOKEN[l1], b1, e1);
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function consumeT(t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function whitespace()
  {
    if (e0 != b1)
    {
      eventHandler.whitespace(e0, b1);
      e0 = b1;
    }
  }

  function matchW(tokenSetId)
  {
    var code;
    for (;;)
    {
      code = match(tokenSetId);
      if (code != 11)               // WhiteSpace^token
      {
        break;
      }
    }
    return code;
  }

  function lookahead1W(tokenSetId)
  {
    if (l1 == 0)
    {
      l1 = matchW(tokenSetId);
      b1 = begin;
      e1 = end;
    }
  }

  function lookahead2W(tokenSetId)
  {
    if (l2 == 0)
    {
      l2 = matchW(tokenSetId);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 6) | l1;
  }

  function lookahead3W(tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = matchW(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 12;
  }

  function error(b, e, s, l, t)
  {
    if (e >= ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    throw new thisParser.ParseException(bx, ex, sx, lx, tx);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var l2, b2, e2;
  var l3, b3, e3;
  var bx, ex, sx, lx, tx;
  var eventHandler;
  var memo;

  function memoize(i, e, v)
  {
    memo[(e << 3) + i] = v;
  }

  function memoized(i, e)
  {
    var v = memo[(e << 3) + i];
    return typeof v != "undefined" ? v : 0;
  }

  var input;
  var size;

  var begin;
  var end;

  function match(tokenSetId)
  {
    begin = end;
    var current = end;
    var result = operators.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 255; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = operators.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 5;
        charclass = operators.MAP1[(c0 & 31) + operators.MAP1[(c1 & 31) + operators.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
          }
        }

        var lo = 0, hi = 1;
        for (var m = 1; ; m = (hi + lo) >> 1)
        {
          if (operators.MAP2[m] > c0) hi = m - 1;
          else if (operators.MAP2[2 + m] < c0) lo = m + 1;
          else {charclass = operators.MAP2[4 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 8) + code - 1;
      code = operators.TRANSITION[(i0 & 7) + operators.TRANSITION[i0 >> 3]];

      if (code > 255)
      {
        result = code;
        code &= 255;
        end = current;
      }
    }

    result >>= 8;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    return (result & 63) - 1;
  }

}

operators.XmlSerializer = function(log, indent)
{
  var input = null;
  var delayedTag = null;
  var hasChildElement = false;
  var depth = 0;

  this.reset = function(string)
  {
    log("<?xml version=\"1.0\" encoding=\"UTF-8\"?" + ">");
    input = string;
    delayedTag = null;
    hasChildElement = false;
    depth = 0;
  };

  this.startNonterminal = function(tag, begin)
  {
    if (delayedTag != null)
    {
      log("<");
      log(delayedTag);
      log(">");
    }
    delayedTag = tag;
    if (indent)
    {
      log("\n");
      for (var i = 0; i < depth; ++i)
      {
        log("  ");
      }
    }
    hasChildElement = false;
    ++depth;
  };

  this.endNonterminal = function(tag, end)
  {
    --depth;
    if (delayedTag != null)
    {
      delayedTag = null;
      log("<");
      log(tag);
      log("/>");
    }
    else
    {
      if (indent)
      {
        if (hasChildElement)
        {
          log("\n");
          for (var i = 0; i < depth; ++i)
          {
            log("  ");
          }
        }
      }
      log("</");
      log(tag);
      log(">");
    }
    hasChildElement = true;
  };

  this.terminal = function(tag, begin, end)
  {
    if (tag.charAt(0) == '\'') tag = "TOKEN";
    this.startNonterminal(tag, begin);
    characters(begin, end);
    this.endNonterminal(tag, end);
  };

  this.whitespace = function(begin, end)
  {
    characters(begin, end);
  };

  function characters(begin, end)
  {
    if (begin < end)
    {
      if (delayedTag != null)
      {
        log("<");
        log(delayedTag);
        log(">");
        delayedTag = null;
      }
      log(input.substring(begin, end)
               .replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;"));
    }
  }
};

operators.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : operators.INITIAL[tokenSetId] & 255;
  for (var i = 0; i < 62; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 205 + s - 1;
    var i1 = i0 >> 2;
    var f = operators.EXPECTED[(i0 & 3) + operators.EXPECTED[(i1 & 3) + operators.EXPECTED[i1 >> 2]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(operators.TOKEN[j]);
      }
    }
  }
  return set;
};

operators.TopDownTreeBuilder = function()
{
  var input = null;
  var stack = null;

  this.reset = function(i)
  {
    input = i;
    stack = [];
  };

  this.startNonterminal = function(name, begin)
  {
    var nonterminal = new operators.Nonterminal(name, begin, begin, []);
    if (stack.length > 0) addChild(nonterminal);
    stack.push(nonterminal);
  };

  this.endNonterminal = function(name, end)
  {
    stack[stack.length - 1].end = end;
    if (stack.length > 1) stack.pop();
  };

  this.terminal = function(name, begin, end)
  {
    addChild(new operators.Terminal(name, begin, end));
  };

  this.whitespace = function(begin, end)
  {
  };

  function addChild(s)
  {
    var current = stack[stack.length - 1];
    current.children.push(s);
  }

  this.serialize = function(e)
  {
    e.reset(input);
    stack[0].send(e);
  };
};

operators.Terminal = function(name, begin, end)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.terminal(name, begin, end);
  };
};

operators.Nonterminal = function(name, begin, end, children)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.startNonterminal(name, begin);
    var pos = begin;
    children.forEach
    (
      function(c)
      {
        if (pos < c.begin) e.whitespace(pos, c.begin);
        c.send(e);
        pos = c.end;
      }
    );
    if (pos < end) e.whitespace(pos, end);
    e.endNonterminal(name, end);
  };
};

operators.MAP0 =
[
  /*   0 */ 66, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 5, 6,
  /*  36 */ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 21, 22, 21, 21, 23, 23, 24, 25, 26, 27, 28, 29,
  /*  64 */ 7, 30, 30, 31, 30, 32, 30, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33,
  /*  91 */ 34, 35, 36, 37, 33, 7, 38, 39, 40, 41, 42, 43, 44, 45, 46, 33, 47, 48, 49, 50, 51, 52, 33, 53, 54, 55, 56,
  /* 118 */ 57, 58, 59, 60, 61, 62, 63, 64, 65, 7
];

operators.MAP1 =
[
  /*   0 */ 54, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
  /*  27 */ 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
  /*  54 */ 90, 122, 216, 154, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185,
  /*  76 */ 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 185, 66, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1,
  /* 102 */ 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  /* 136 */ 17, 18, 19, 20, 20, 20, 21, 22, 21, 21, 23, 23, 24, 25, 26, 27, 28, 29, 7, 38, 39, 40, 41, 42, 43, 44, 45,
  /* 163 */ 46, 33, 47, 48, 49, 50, 51, 52, 33, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 7, 7, 7, 7, 7, 7, 7,
  /* 192 */ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 30, 30, 31, 30, 32, 30, 33, 33,
  /* 225 */ 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 34, 35, 36, 37, 33
];

operators.MAP2 =
[
  /* 0 */ 57344, 65536, 65533, 1114111, 7, 7
];

operators.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 523, 12, 13, 526, 15, 16, 17, 18, 19, 20, 21, 22, 23, 536, 537
];

operators.TRANSITION =
[
  /*    0 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*   18 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*   36 */ 2176, 2152, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*   54 */ 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2144, 2144, 2144, 2150, 2176, 2152, 3230, 2176,
  /*   72 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190,
  /*   90 */ 2176, 2176, 2176, 2176, 2176, 2176, 2144, 2144, 2144, 2150, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  108 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  126 */ 2176, 2176, 2176, 2160, 2168, 2175, 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  144 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2187,
  /*  162 */ 2177, 2515, 2176, 2959, 3230, 2176, 2176, 2176, 2176, 2176, 2178, 2723, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  180 */ 2176, 2176, 2176, 2176, 3648, 2198, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 3815, 3229, 2421, 2176, 2152,
  /*  198 */ 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  216 */ 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2152, 3230, 2176, 2176, 2176,
  /*  234 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176,
  /*  252 */ 2176, 2176, 2176, 2176, 2176, 2176, 2211, 2218, 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  270 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  288 */ 2176, 2176, 2227, 2234, 2176, 2152, 3230, 2765, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  306 */ 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2243, 2516, 2250,
  /*  324 */ 2176, 2178, 3230, 2176, 2176, 2176, 2176, 2176, 2331, 2723, 2176, 2176, 2176, 2176, 2259, 2176, 2176, 2176,
  /*  342 */ 2176, 2176, 2262, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3085, 3473, 3469, 2270, 2176, 2152, 3230, 2176,
  /*  360 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190,
  /*  378 */ 2176, 2176, 2176, 2176, 2176, 2176, 2279, 3716, 3719, 2280, 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176,
  /*  396 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176,
  /*  414 */ 2176, 2176, 2176, 2176, 2289, 2296, 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  432 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2567, 2305,
  /*  450 */ 2313, 2320, 2176, 3536, 3230, 2176, 2329, 2176, 2176, 2176, 2176, 3288, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  468 */ 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3788, 3154, 2339, 2346, 2176, 2152,
  /*  486 */ 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  504 */ 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2398, 2355, 2363, 2371, 2176, 3609, 3871, 2176, 2380, 2393,
  /*  522 */ 2176, 2176, 2176, 3288, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176,
  /*  540 */ 2176, 2176, 2176, 2176, 3207, 2176, 3968, 2406, 2176, 2152, 2415, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  558 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  576 */ 2176, 3144, 2430, 2437, 2176, 2152, 2986, 2176, 2176, 2418, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  594 */ 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2446, 2709, 2460,
  /*  612 */ 2856, 3100, 2452, 2463, 2176, 3053, 2856, 2856, 2492, 2472, 3560, 2856, 2856, 3003, 2483, 2856, 2856, 3931,
  /*  630 */ 2500, 2503, 3494, 2511, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2446, 2709, 2460, 2856, 3100, 2452, 2463,
  /*  648 */ 2176, 3053, 2856, 2856, 2492, 2472, 3560, 2856, 2856, 3118, 2524, 2856, 2856, 2931, 2539, 2475, 3494, 2190,
  /*  666 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2446, 2709, 2460, 2856, 3100, 2452, 2463, 2176, 3053, 2856, 2856,
  /*  684 */ 2492, 2550, 3560, 2856, 2856, 3118, 2524, 2856, 2856, 2931, 2539, 2475, 3494, 2190, 2176, 2176, 2176, 2176,
  /*  702 */ 2176, 2176, 2176, 2446, 2709, 2460, 2856, 3100, 2452, 2463, 2176, 3053, 2856, 2856, 2492, 2550, 3560, 2856,
  /*  720 */ 2856, 3118, 2524, 2856, 2856, 2931, 2539, 2542, 2561, 2578, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2446,
  /*  738 */ 2709, 2460, 2856, 3100, 2452, 2463, 2176, 3053, 2856, 2856, 2462, 2591, 3560, 2856, 2856, 3118, 2664, 2856,
  /*  756 */ 2856, 2931, 2539, 2475, 3494, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3980, 2176, 2602, 3984, 2176, 2152,
  /*  774 */ 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  792 */ 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2774, 3770, 3766, 2610, 2176, 2152, 3230, 2176, 2176, 2176,
  /*  810 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176,
  /*  828 */ 2176, 2176, 2176, 2176, 2176, 2176, 2619, 2626, 2176, 2152, 3230, 2176, 4004, 2176, 2176, 2176, 2176, 2176,
  /*  846 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  864 */ 2176, 2176, 2635, 2642, 2176, 2152, 3230, 3681, 2651, 2659, 2176, 2176, 2176, 2176, 3848, 2176, 2176, 2176,
  /*  882 */ 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2672, 2679,
  /*  900 */ 2176, 3901, 3230, 2176, 3257, 2688, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /*  918 */ 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2701, 2708, 2176, 2152, 3230, 2176,
  /*  936 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190,
  /*  954 */ 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856,
  /*  972 */ 2462, 2385, 3560, 2856, 2856, 3118, 3063, 2856, 2856, 2931, 2539, 2475, 3494, 2190, 2176, 2176, 2176, 2176,
  /*  990 */ 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856,
  /* 1008 */ 2856, 3118, 3063, 2856, 2856, 2931, 2539, 2475, 2717, 2732, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856,
  /* 1026 */ 2724, 2490, 2856, 3100, 2745, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856, 2856, 3118, 2583, 2856,
  /* 1044 */ 2856, 2931, 2539, 2475, 3494, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100,
  /* 1062 */ 3563, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856, 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463,
  /* 1080 */ 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 4027, 4023, 2764, 2176, 2152, 3230, 2176, 2176, 2176,
  /* 1098 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176,
  /* 1116 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2898, 3230, 2176, 2176, 2176, 2176, 2176, 2178, 2773,
  /* 1134 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2570, 2782, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 1152 */ 2801, 2203, 3500, 2800, 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 1170 */ 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2809, 2816,
  /* 1188 */ 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 1206 */ 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2832, 2825, 2422, 2841, 2855, 3100, 3018, 3344,
  /* 1224 */ 2176, 2383, 2866, 3376, 2462, 3853, 3574, 2875, 2856, 3753, 3063, 3800, 2856, 2931, 2539, 2475, 3494, 2190,
  /* 1242 */ 2176, 2176, 2176, 2176, 2176, 2176, 2896, 2889, 2219, 2906, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856,
  /* 1260 */ 2492, 2946, 3560, 2916, 2856, 3118, 3063, 2927, 2856, 2931, 2539, 2475, 2939, 2190, 2176, 2176, 2176, 2176,
  /* 1278 */ 2176, 2176, 2957, 2967, 2438, 2974, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856,
  /* 1296 */ 2856, 3118, 3063, 2856, 3217, 2931, 2539, 2847, 2717, 2732, 2176, 2176, 2176, 2176, 2176, 2176, 2984, 2994,
  /* 1314 */ 3985, 3001, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856, 2856, 2792, 3063, 2856,
  /* 1332 */ 2856, 3011, 2539, 2475, 3494, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3083, 3076, 2235, 3093, 2553, 3100,
  /* 1350 */ 2745, 3098, 2176, 3387, 2856, 2856, 2462, 2385, 3311, 3512, 3670, 3108, 2583, 3116, 3927, 2931, 3126, 3835,
  /* 1368 */ 3138, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3152, 3162, 2611, 3169, 3445, 3100, 3563, 3058, 2176, 2383,
  /* 1386 */ 3179, 2856, 2492, 2946, 3560, 2856, 2856, 3118, 3063, 2856, 2856, 2931, 2539, 3190, 2939, 2190, 2176, 2176,
  /* 1404 */ 2176, 2176, 2176, 2176, 3205, 3198, 2251, 3215, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 3741, 2462, 2385,
  /* 1422 */ 3560, 2858, 2856, 2462, 2724, 3620, 2856, 3225, 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 1440 */ 3228, 2856, 2724, 3488, 3274, 3238, 3563, 3246, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856, 2856, 2462,
  /* 1458 */ 2724, 2856, 2856, 2464, 2385, 3058, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3255, 3265, 2627, 3272,
  /* 1476 */ 3420, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 3282, 2385, 3560, 2856, 3299, 3308, 2724, 2881, 3431, 2464,
  /* 1494 */ 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100, 3563, 2463,
  /* 1512 */ 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856, 2856, 2462, 2724, 2858, 2856, 2464, 2385, 2463, 3347, 2190,
  /* 1530 */ 2176, 2176, 2176, 2176, 2176, 2176, 3319, 3330, 2643, 3337, 3355, 3100, 3039, 3364, 2176, 2383, 3171, 3737,
  /* 1548 */ 3457, 2787, 3560, 2857, 2856, 2594, 2724, 3375, 2856, 2464, 2737, 2463, 3347, 2190, 2176, 2176, 2176, 2176,
  /* 1566 */ 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 3444,
  /* 1584 */ 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3384, 3395,
  /* 1602 */ 2372, 3402, 2878, 3410, 3563, 3711, 2176, 2383, 3418, 3428, 2492, 2946, 3439, 2856, 3453, 2462, 2724, 2856,
  /* 1620 */ 2856, 3465, 2756, 2463, 3367, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 3481, 3508, 3523,
  /* 1638 */ 3046, 3531, 2176, 2383, 3356, 2919, 2462, 2385, 3544, 2856, 2856, 3557, 2724, 2856, 3883, 2464, 2385, 2463,
  /* 1656 */ 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100, 3563, 2463, 2176, 2383,
  /* 1674 */ 2856, 2856, 3571, 2385, 3560, 2856, 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463, 3347, 2190, 2176, 2176,
  /* 1692 */ 2176, 2176, 2176, 2176, 3589, 3582, 2271, 3600, 2867, 3100, 3025, 2463, 2176, 2383, 2856, 3549, 2492, 2946,
  /* 1710 */ 3560, 2856, 2878, 2462, 2724, 3617, 3628, 2464, 2385, 2463, 3367, 2190, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 1728 */ 3645, 3638, 2281, 3656, 2856, 3100, 3563, 2463, 2176, 3322, 2856, 2856, 3914, 2385, 3560, 2880, 2856, 2462,
  /* 1746 */ 2680, 2856, 3666, 2464, 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3678, 3689, 2407, 3696,
  /* 1764 */ 3630, 3100, 3563, 2463, 2176, 3592, 2949, 3706, 2492, 2946, 3727, 3749, 3182, 2462, 2724, 2856, 2856, 3605,
  /* 1782 */ 2693, 3761, 3367, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3785, 3778, 2297, 3796, 3130, 3100, 3032, 2463,
  /* 1800 */ 2176, 2383, 3732, 2856, 3808, 3823, 3560, 2856, 3515, 2908, 2752, 2856, 3831, 3247, 2385, 2463, 3347, 3843,
  /* 1818 */ 2176, 2176, 2176, 2176, 2176, 2176, 3868, 3861, 2321, 3879, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856,
  /* 1836 */ 2462, 2385, 3560, 2856, 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176,
  /* 1854 */ 2176, 2176, 3898, 3891, 2347, 3909, 3658, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856,
  /* 1872 */ 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856,
  /* 1890 */ 2724, 2531, 2856, 3100, 3563, 2463, 2176, 2383, 2856, 2856, 2976, 3922, 3560, 2856, 2856, 2462, 2724, 2856,
  /* 1908 */ 2856, 2464, 2385, 2463, 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 2490, 3300, 3100,
  /* 1926 */ 3068, 2463, 2176, 2383, 2856, 2856, 2462, 2385, 3560, 2856, 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463,
  /* 1944 */ 3347, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3228, 2856, 2724, 2490, 2856, 3100, 3563, 2463, 2176, 2383,
  /* 1962 */ 2856, 3698, 2462, 2385, 3560, 2856, 2856, 2462, 2724, 2856, 2856, 2464, 2385, 2463, 3347, 2190, 2176, 2176,
  /* 1980 */ 2176, 2176, 2176, 2176, 2176, 3939, 2817, 3946, 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 1998 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 2016 */ 2176, 2176, 3957, 3964, 2176, 2152, 3230, 2176, 2176, 3976, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 2034 */ 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 3949, 2176, 3993, 4000,
  /* 2052 */ 2176, 2152, 3230, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 2070 */ 2176, 2176, 2179, 2190, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 4012, 2833, 4019, 2176, 2152, 3230, 2176,
  /* 2088 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2179, 2190,
  /* 2106 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 3291, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 2124 */ 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176, 2176,
  /* 2142 */ 2176, 2176, 3098, 3098, 3098, 3098, 3098, 3098, 3098, 3098, 0, 0, 0, 0, 0, 0, 47, 104, 0, 3328, 3328, 3328,
  /* 2164 */ 3328, 3328, 3328, 3328, 62, 62, 62, 62, 62, 62, 62, 3390, 0, 0, 0, 0, 0, 0, 0, 0, 47, 0, 0, 47, 47, 47, 47,
  /* 2191 */ 47, 47, 47, 47, 0, 0, 0, 2351, 2304, 2304, 2304, 2304, 0, 0, 0, 0, 12544, 0, 12544, 12544, 3903, 3903,
  /* 2213 */ 3903, 3903, 3903, 3903, 3903, 3903, 0, 0, 0, 0, 0, 0, 0, 1053, 4416, 4416, 4416, 4416, 4416, 4416, 4416,
  /* 2234 */ 4416, 0, 0, 0, 0, 0, 0, 0, 1056, 48, 48, 48, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 1058, 2048, 2048,
  /* 2261 */ 2048, 0, 0, 0, 0, 0, 47, 0, 2152, 5120, 0, 0, 0, 0, 0, 0, 0, 1062, 0, 5376, 0, 0, 0, 0, 0, 0, 0, 1063,
  /* 2289 */ 5697, 5697, 5697, 5697, 5697, 5697, 5697, 5697, 0, 0, 0, 0, 0, 0, 0, 1065, 0, 44, 44, 44, 44, 44, 44, 44,
  /* 2313 */ 6210, 6210, 6210, 6210, 6210, 6210, 6210, 6210, 0, 0, 0, 0, 0, 0, 0, 1066, 0, 6400, 0, 0, 0, 0, 0, 0, 47,
  /* 2338 */ 2048, 0, 6912, 6912, 6912, 0, 6912, 6912, 6912, 0, 0, 0, 0, 0, 0, 0, 1067, 49, 54, 54, 54, 54, 54, 54, 54,
  /* 2363 */ 7235, 7235, 7235, 7235, 7242, 7242, 7242, 7243, 7245, 0, 0, 0, 0, 0, 0, 0, 1076, 0, 0, 7424, 0, 0, 0, 0, 0,
  /* 2388 */ 1051, 1051, 1051, 1051, 1051, 0, 7424, 7424, 0, 7424, 0, 0, 0, 45, 0, 0, 46, 0, 8192, 0, 0, 0, 0, 0, 0, 0,
  /* 2414 */ 1077, 0, 106, 0, 0, 0, 0, 2871, 0, 0, 0, 0, 0, 0, 0, 1052, 8516, 8516, 8516, 8516, 8516, 8516, 8516, 8524,
  /* 2438 */ 0, 0, 0, 0, 0, 0, 0, 1081, 2610, 2610, 2610, 2610, 2610, 2610, 2610, 2610, 1051, 1051, 1051, 2610, 2871, 0,
  /* 2460 */ 2610, 0, 1051, 1051, 1051, 1051, 1051, 1051, 0, 0, 0, 0, 145, 2710, 2711, 1051, 1051, 1051, 1051, 1051,
  /* 2480 */ 175, 0, 179, 146, 104, 0, 177, 179, 2710, 2711, 1051, 0, 1051, 1051, 1051, 1051, 1051, 1051, 47, 0, 192,
  /* 2501 */ 149, 104, 1051, 1051, 1051, 1051, 1051, 175, 196, 179, 47, 203, 204, 47, 47, 0, 0, 0, 0, 0, 0, 0, 48, 146,
  /* 2525 */ 104, 0, 178, 179, 2710, 2711, 1051, 0, 1051, 1051, 1051, 1051, 1051, 1110, 149, 149, 104, 1051, 1051, 1051,
  /* 2545 */ 1051, 1051, 195, 0, 197, 146, 2710, 2711, 1051, 1051, 1051, 1051, 1051, 1117, 1051, 1051, 1051, 1051, 47,
  /* 2564 */ 199, 104, 47, 0, 0, 44, 0, 0, 0, 0, 0, 201, 0, 147, 47, 47, 47, 205, 47, 0, 0, 0, 178, 179, 107, 0, 1051,
  /* 2591 */ 0, 2710, 2711, 1051, 1051, 1051, 1051, 1051, 1144, 0, 0, 0, 0, 8960, 0, 0, 8960, 0, 8960, 9216, 0, 0, 0, 0,
  /* 2615 */ 0, 0, 0, 1083, 9541, 9541, 9541, 9541, 9541, 9541, 9541, 9541, 0, 0, 0, 0, 0, 0, 0, 1084, 10566, 10566,
  /* 2637 */ 10566, 10566, 10566, 10566, 10566, 10566, 0, 0, 0, 0, 0, 0, 0, 1085, 5888, 6656, 7680, 8704, 10240, 10752,
  /* 2657 */ 11264, 13056, 15104, 7680, 7680, 8704, 7680, 0, 0, 0, 178, 179, 2710, 2711, 1051, 11079, 11079, 11079,
  /* 2675 */ 11079, 11079, 11079, 11079, 11079, 0, 0, 0, 0, 0, 0, 0, 1204, 0, 7936, 0, 0, 7936, 0, 0, 0, 1051, 1051,
  /* 2698 */ 13851, 1051, 1051, 12032, 12032, 12032, 12032, 12032, 12032, 12032, 12032, 0, 0, 0, 0, 0, 0, 0, 2610, 1051,
  /* 2718 */ 1051, 198, 0, 200, 47, 104, 0, 0, 0, 0, 0, 0, 0, 1051, 47, 47, 47, 47, 198, 0, 0, 0, 1051, 1217, 1051,
  /* 2743 */ 1051, 1114, 0, 107, 1051, 1051, 1051, 0, 2871, 0, 0, 176, 148, 0, 0, 0, 1051, 1051, 1051, 1122, 1051,
  /* 2764 */ 12288, 0, 0, 0, 0, 0, 0, 0, 4608, 147, 0, 0, 0, 0, 0, 0, 0, 9216, 201, 103, 103, 103, 103, 0, 0, 0, 1176,
  /* 2791 */ 1177, 1051, 1051, 1051, 27, 1051, 1051, 174, 175, 12544, 0, 0, 0, 0, 0, 0, 0, 12544, 12872, 12872, 12872,
  /* 2812 */ 12872, 12872, 12872, 12872, 12872, 0, 0, 0, 0, 0, 0, 0, 14592, 1052, 1052, 1052, 1052, 1052, 1052, 1052,
  /* 2832 */ 1052, 0, 0, 0, 0, 0, 0, 0, 15872, 1052, 0, 1051, 1051, 1051, 1104, 1051, 1051, 27, 1051, 1051, 175, 0, 179,
  /* 2855 */ 1111, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 27, 1051, 1113, 1051, 1051, 1051, 1051, 1051, 1051,
  /* 2873 */ 1051, 1122, 1051, 1185, 1051, 1051, 1051, 1114, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1207, 1053, 1053,
  /* 2891 */ 1053, 1053, 1053, 1053, 1053, 1053, 0, 0, 0, 0, 0, 0, 0, 103, 105, 1053, 0, 1051, 1051, 1051, 1051, 1051,
  /* 2913 */ 1051, 143, 0, 1051, 1051, 1166, 1051, 1051, 1051, 1051, 1051, 1155, 1051, 1051, 1051, 1051, 1051, 1205,
  /* 2931 */ 1051, 1051, 1051, 1051, 144, 144, 47, 0, 1051, 1051, 47, 0, 104, 47, 0, 104, 0, 0, 1051, 1051, 1051, 1051,
  /* 2953 */ 1051, 1149, 1051, 1051, 1054, 0, 0, 0, 0, 0, 0, 0, 2304, 104, 1054, 1054, 1081, 1081, 1081, 1081, 1081,
  /* 2974 */ 1081, 0, 1051, 1051, 1051, 1051, 1051, 1051, 144, 0, 1055, 0, 0, 0, 0, 0, 0, 0, 2871, 2871, 1055, 1055,
  /* 2996 */ 1082, 1082, 1082, 1082, 1082, 1082, 0, 1051, 1051, 1051, 1051, 1051, 1051, 173, 175, 1213, 1051, 1051,
  /* 3014 */ 1051, 144, 144, 47, 0, 0, 1132, 1051, 1051, 0, 2871, 0, 0, 1051, 1051, 1134, 0, 2871, 0, 0, 1051, 1133,
  /* 3036 */ 1051, 0, 2871, 0, 0, 1112, 1051, 1051, 0, 2871, 0, 0, 1113, 1051, 1051, 0, 2871, 0, 0, 2610, 0, 2610, 1051,
  /* 3059 */ 1051, 1051, 27, 1051, 0, 0, 0, 178, 179, 0, 0, 1051, 1051, 1123, 0, 2871, 0, 1056, 1056, 1056, 1056, 1056,
  /* 3081 */ 1056, 1056, 1056, 0, 0, 0, 0, 0, 0, 0, 5120, 0, 1056, 0, 1051, 1051, 1051, 1051, 1107, 1051, 1051, 1051, 0,
  /* 3104 */ 0, 0, 47, 104, 1193, 1051, 1051, 1051, 1051, 1051, 174, 175, 1051, 1563, 1051, 1051, 1051, 1051, 1051,
  /* 3123 */ 1051, 174, 175, 149, 149, 104, 1819, 1051, 1051, 1051, 1051, 1116, 1051, 1051, 1051, 13595, 1113, 47, 0,
  /* 3142 */ 104, 47, 0, 0, 56, 56, 56, 56, 56, 56, 1057, 0, 0, 0, 0, 0, 0, 0, 6912, 6912, 1075, 1075, 1083, 1083, 1083,
  /* 3167 */ 1083, 1083, 1083, 0, 1051, 1051, 1051, 1051, 1051, 1051, 1104, 1051, 1051, 1051, 1146, 1051, 1051, 1051,
  /* 3185 */ 1051, 1051, 1190, 1051, 1192, 1051, 27, 1051, 1051, 1051, 175, 0, 179, 1058, 1058, 1058, 1058, 1058, 1058,
  /* 3204 */ 1058, 1058, 0, 0, 0, 0, 0, 0, 0, 8192, 0, 1058, 0, 1051, 1051, 1051, 1051, 1051, 1051, 1114, 1212, 1051,
  /* 3226 */ 1051, 1156, 1051, 0, 0, 0, 0, 0, 0, 0, 2871, 0, 1051, 1051, 1126, 0, 0, 0, 47, 104, 1135, 1051, 1051, 1051,
  /* 3250 */ 1051, 0, 0, 0, 176, 1059, 0, 0, 0, 0, 0, 0, 0, 11637, 0, 1059, 1059, 1084, 1084, 1084, 1084, 1084, 1084, 0,
  /* 3274 */ 1051, 1051, 1051, 1051, 1051, 1051, 1118, 1051, 1160, 1051, 1051, 1162, 1164, 1166, 0, 0, 151, 0, 0, 0, 0,
  /* 3295 */ 0, 768, 0, 0, 1187, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1123, 1051, 1051, 1195, 1051, 1051, 1051, 0,
  /* 3315 */ 0, 1051, 1051, 27, 1060, 0, 0, 0, 0, 0, 0, 0, 1051, 1051, 1144, 1060, 1060, 1085, 1085, 1085, 1085, 1085,
  /* 3337 */ 1085, 0, 1051, 1051, 1051, 1051, 1051, 1104, 1051, 1132, 1051, 1051, 0, 0, 0, 47, 0, 0, 1112, 1051, 1051,
  /* 3358 */ 1051, 1051, 1051, 1051, 1051, 1150, 1051, 1051, 1137, 1051, 1051, 0, 0, 0, 47, 0, 104, 1307, 1051, 1051,
  /* 3378 */ 1051, 1051, 1051, 1051, 1051, 1158, 1061, 0, 0, 0, 0, 0, 0, 0, 1051, 1143, 1051, 1076, 1076, 1076, 1076,
  /* 3399 */ 1076, 1076, 1076, 1076, 0, 1051, 1051, 1051, 1051, 1051, 1109, 1124, 1051, 1051, 0, 0, 0, 47, 104, 1051,
  /* 3419 */ 1145, 1051, 1051, 1051, 1051, 1051, 1051, 1119, 1051, 1051, 1051, 1151, 1051, 1051, 1051, 1051, 1051, 1211,
  /* 3437 */ 1051, 1051, 1051, 1051, 1182, 0, 0, 1051, 1051, 1051, 27, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1051,
  /* 3456 */ 1188, 1051, 1051, 1051, 1051, 1165, 1051, 0, 0, 1051, 27, 1051, 1051, 0, 0, 0, 0, 5120, 5120, 5120, 5120,
  /* 3477 */ 5120, 5120, 5120, 5120, 1051, 0, 1051, 1051, 1051, 1106, 84, 1051, 0, 1051, 1051, 1051, 1105, 1051, 1051,
  /* 3496 */ 47, 0, 104, 47, 0, 0, 0, 12544, 0, 0, 12544, 12544, 1113, 1102, 1051, 1115, 1051, 1051, 1051, 1051, 1186,
  /* 3517 */ 1051, 1051, 1051, 1051, 1191, 1051, 1051, 1125, 1051, 0, 0, 0, 47, 104, 1106, 112, 1113, 1051, 1139, 0, 0,
  /* 3538 */ 0, 6400, 0, 0, 47, 104, 1181, 1051, 1051, 0, 0, 27, 1051, 1051, 1051, 1051, 1051, 1051, 1159, 1051, 1194,
  /* 3559 */ 1051, 1051, 1051, 1051, 0, 0, 1051, 1051, 1051, 0, 2871, 0, 1051, 1051, 1161, 1051, 1051, 1051, 0, 0, 1051,
  /* 3580 */ 1183, 1051, 1062, 1062, 1062, 1062, 1062, 1062, 1062, 1062, 0, 0, 0, 0, 0, 0, 0, 1142, 1051, 1051, 1062, 0,
  /* 3602 */ 1051, 1051, 1103, 1051, 1051, 1051, 1126, 0, 0, 0, 0, 7424, 0, 47, 104, 1051, 1051, 13339, 1051, 1051,
  /* 3622 */ 1051, 1051, 1051, 14363, 1051, 1051, 1051, 1194, 1051, 1051, 1051, 1051, 1051, 1051, 1120, 1051, 1063,
  /* 3639 */ 1063, 1063, 1063, 1063, 1063, 1063, 1063, 0, 0, 0, 0, 0, 0, 0, 2351, 0, 104, 1063, 0, 1051, 1051, 1051,
  /* 3661 */ 1051, 1051, 1051, 1121, 1051, 1051, 1051, 1209, 1051, 1051, 1051, 1051, 1051, 1189, 1051, 1051, 1051, 1064,
  /* 3679 */ 0, 0, 0, 0, 0, 0, 0, 3584, 4096, 4864, 1077, 1077, 1077, 1077, 1077, 1077, 1077, 1077, 0, 1051, 1051, 1051,
  /* 3701 */ 1051, 1051, 1051, 1157, 1051, 1051, 27, 1051, 1051, 1154, 1051, 1051, 1051, 1138, 1051, 0, 0, 0, 5376, 0,
  /* 3721 */ 0, 0, 5376, 0, 0, 5376, 1051, 14107, 1051, 0, 0, 1051, 1051, 1051, 1147, 1148, 1051, 1051, 1051, 1152,
  /* 3741 */ 1051, 1051, 1051, 1051, 1153, 1051, 1156, 1051, 1184, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1196, 1051,
  /* 3759 */ 174, 175, 1218, 1051, 1051, 1051, 1051, 0, 0, 0, 9216, 0, 0, 9216, 9216, 9216, 9216, 9216, 9216, 1065,
  /* 3779 */ 1065, 1065, 1065, 1065, 1065, 1065, 1065, 0, 0, 0, 0, 0, 0, 0, 6912, 0, 6912, 1065, 0, 1051, 1102, 1051,
  /* 3801 */ 1051, 1051, 1051, 1206, 1051, 1051, 1051, 1051, 1144, 1051, 1051, 1051, 1051, 143, 0, 0, 2871, 2871, 2871,
  /* 3820 */ 2871, 2871, 2871, 148, 0, 0, 1051, 1051, 1178, 1051, 1180, 1208, 1051, 1051, 1051, 1051, 1051, 1051, 1051,
  /* 3839 */ 1210, 175, 0, 179, 202, 202, 47, 47, 47, 0, 0, 0, 9984, 11776, 0, 0, 0, 1051, 1051, 1051, 1179, 1051, 1066,
  /* 3862 */ 1066, 1066, 1066, 1066, 1066, 1066, 1066, 0, 0, 0, 0, 0, 0, 0, 7424, 2871, 0, 1066, 0, 1051, 1051, 1051,
  /* 3884 */ 1051, 1051, 1051, 1210, 1051, 1051, 1051, 1067, 1067, 1067, 1067, 1067, 1067, 1067, 1067, 0, 0, 0, 0, 0, 0,
  /* 3905 */ 0, 7936, 47, 104, 1067, 0, 1051, 1051, 1051, 1051, 1051, 1051, 1163, 1051, 1051, 0, 0, 149, 0, 0, 1051,
  /* 3926 */ 1051, 1051, 1051, 1051, 1164, 1051, 1051, 1051, 1051, 190, 144, 47, 191, 14592, 14592, 14592, 14592, 14592,
  /* 3944 */ 14592, 14592, 14592, 0, 0, 0, 0, 0, 0, 0, 15616, 0, 0, 14921, 14921, 14921, 14921, 14921, 14921, 14921,
  /* 3964 */ 14921, 0, 0, 0, 0, 0, 0, 0, 8192, 8192, 8192, 0, 15360, 0, 0, 0, 0, 0, 0, 0, 8960, 0, 0, 0, 0, 0, 0, 0,
  /* 3992 */ 1082, 0, 15616, 15616, 0, 0, 15616, 0, 15616, 0, 0, 0, 0, 0, 0, 0, 9844, 0, 0, 0, 0, 15872, 15872, 15872,
  /* 4016 */ 15872, 15872, 15872, 15872, 0, 0, 0, 0, 0, 0, 0, 12288, 12288, 12288, 12288, 12288, 12288, 12288, 12288
];

operators.EXPECTED =
[
  /*   0 */ 26, 30, 52, 38, 42, 33, 46, 50, 34, 56, 59, 63, 67, 71, 75, 92, 84, 81, 92, 77, 91, 92, 87, 92, 96, 92, 100,
  /*  27 */ 104, 108, 112, 116, 120, 124, 160, 160, 160, 160, 177, 166, 140, 126, 144, 148, 185, 228, 159, 160, 172,
  /*  48 */ 165, 170, 161, 154, 160, 160, 155, 130, 135, 165, 170, 160, 160, 160, 180, 136, 160, 160, 173, 172, 133,
  /*  69 */ 179, 184, 151, 190, 193, 196, 200, 204, 185, 185, 186, 209, 215, 219, 232, 185, 207, 211, 185, 186, 240,
  /*  90 */ 185, 236, 185, 185, 185, 185, 225, 185, 185, 222, 2056, 1050624, 16779264, 268437504, 2048, 67110912,
  /* 106 */ -1073215488, 67110912, 527352, 285744120, 285745144, 286793720, 285745144, 285745148, 352854008, 353902584,
  /* 116 */ 1006102528, 1072162816, 1072162816, 1072162816, -67115008, -1054720, -1054720, 1073741816, -8, 2048, 8, 8,
  /* 128 */ 72, 8, 268435456, 1073741824, 256, 128, 256, 128, 128, 128, 128, 72, 40, 268435968, 1024, 1024, 8, 8192,
  /* 146 */ 32768, 393216, 4194304, 50331648, 805306368, 0, 4, 268435456, 0, 8, 8, 8, 16777216, 1879048704, 8, 8, 8, 8,
  /* 164 */ 0, 128, 512, 512, 72, 24, 24, 40, 8, 8, 256, 128, 128, 8, 8, 256, 256, 256, 256, 128, 256, 0, 0, 0, 0,
  /* 189 */ 524288, 65544, 16809984, 553680896, 569933832, 569999368, 569933832, 569999368, 235306995, 503742451,
  /* 199 */ 503742455, 235372539, 235339763, 503775223, 235405307, 1073741823, 1073741823, 0, 0, 524288, 1048576,
  /* 210 */ 2097152, 4194304, 8388608, 0, 0, 2, 224, 512, 14336, 262144, 201326592, 0, 0, 1048576, 0, 0, 1048576,
  /* 227 */ 2097152, 0, 1879048192, 805306880, 1024, 2, 0, 0, 0, 64, 8192, 0, 0, 1048576, 2097152, 8388608, 0
];

operators.TOKEN =
[
  "(0)",
  "END",
  "EOF",
  "Identifier",
  "'null'",
  "'true'",
  "'false'",
  "Character",
  "String",
  "Real",
  "Comment",
  "WhiteSpace",
  "'!'",
  "'!='",
  "'%'",
  "'%='",
  "'&'",
  "'&&'",
  "'&='",
  "'('",
  "')'",
  "'*'",
  "'*='",
  "'+'",
  "'++'",
  "'+='",
  "','",
  "'-'",
  "'--'",
  "'-='",
  "'->'",
  "'.'",
  "'/'",
  "'/='",
  "':'",
  "';'",
  "'<'",
  "'<<'",
  "'<<='",
  "'<='",
  "'='",
  "'=='",
  "'>'",
  "'>='",
  "'>>'",
  "'>>='",
  "'?'",
  "'['",
  "']'",
  "'^'",
  "'^='",
  "'char'",
  "'double'",
  "'float'",
  "'int'",
  "'long'",
  "'{'",
  "'|'",
  "'|='",
  "'||'",
  "'}'",
  "'~'"
];

// main program for use with node.js, rhino, or jrunscript

function main(args)
{
  if (typeof process !== "undefined")   // assume node.js
  {
    var command = "node";
    var arguments = process.argv.slice(2);
    var log = function(string) {process.stdout.write(string);};
    var fs = require("fs");
    var readTextFile = fs.readFileSync;
  }
  else                                  // assume rhino or jrunscript
  {
    var arguments = function()
                    {
                      var strings = [];
                      for (var i = 0; i < args.length; ++i)
                      {
                        strings[i] = String(args[i]);
                      }
                      return strings;
                    }();

    if (typeof println == "undefined")  // assume rhino
    {
      var command = "java -jar js.jar";
      var log = function(string) {java.lang.System.out.write(java.lang.String(string).getBytes("utf-8"));};
      var readTextFile = readFile;
    }
    else                                // assume jrunscript
    {
      var command = "jrunscript";
      var log = function(string) {java.lang.System.out.print(string);};
      var readTextFile = function(filename, encoding)
                         {
                           var file = new java.io.File(filename);
                           var buffer = javaByteArray(file.length());
                           new java.io.FileInputStream(file).read(buffer);
                           return String(new java.lang.String(buffer, encoding));
                         };
    }
  }

  function read(input)
  {
    if (/^{.*}$/.test(input))
    {
      return input.substring(1, input.length - 1);
    }
    else
    {
      var content = readTextFile(input, "utf-8");
      return content.length > 0 && content.charCodeAt(0) == 0xFEFF
           ? content.substring(1)
           : content;
    }
  }

  if (arguments.length == 0)
  {
    log("Usage: " + command + " operators.js [-i] INPUT...\n");
    log("\n");
    log("  parse INPUT, which is either a filename or literal text enclosed in curly braces\n");
    log("\n");
    log("  Option:\n");
    log("    -i     indented parse tree\n");
  }
  else
  {
    var indent = false;
    for (var i = 0; i < arguments.length; ++i)
    {
      if (arguments[i] === "-i")
      {
        indent = true;
        continue;
      }
      var input = read(String(arguments[i]));
      var s = new operators.XmlSerializer(log, indent);
      var parser = new operators(input, s);
      try
      {
        parser.parse_Program();
      }
      catch (pe)
      {
        if (! (pe instanceof parser.ParseException))
        {
          throw pe;
        }
        else
        {
          throw parser.getErrorMessage(pe);
        }
      }
    }
  }
}

main(arguments);

// End
