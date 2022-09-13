// This file was generated on Tue Sep 13, 2022 11:59 (UTC-03) by REx v5.55 which is Copyright (c) 1979-2022 by Gunther Rademacher <grd@gmx.net>
// REx command line: Operators.ebnf -backtrack -javascript -main -tree

function Operators(string, parsingEventHandler)
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
    return o >= 0 ? Operators.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = Operators.getTokenSet(- e.getState());
    }
    else
    {
      expected = [Operators.TOKEN[e.getExpected()]];
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
    lookahead1W(15);                // END | EOF | Identifier | Null | True | False | Character | String | Real |
                                    // Comment | WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    switch (l1)
    {
    case 2:                         // EOF
      consume(2);                   // EOF
      break;
    default:
      for (;;)
      {
        lookahead1W(12);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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

  function parse_Expression()
  {
    eventHandler.startNonterminal("Expression", e0);
    switch (l1)
    {
    case 3:                         // Identifier
    case 4:                         // Null
    case 5:                         // True
    case 6:                         // False
    case 7:                         // Character
    case 8:                         // String
    case 9:                         // Real
    case 12:                        // '!'
    case 19:                        // '('
    case 24:                        // '++'
    case 28:                        // '--'
    case 47:                        // '['
    case 66:                        // '{'
    case 71:                        // '~'
      parse_Operation();
      break;
    case 10:                        // Comment
      consume(10);                  // Comment
      break;
    default:
      parse_Statement();
    }
    eventHandler.endNonterminal("Expression", e0);
  }

  function try_Expression()
  {
    switch (l1)
    {
    case 3:                         // Identifier
    case 4:                         // Null
    case 5:                         // True
    case 6:                         // False
    case 7:                         // Character
    case 8:                         // String
    case 9:                         // Real
    case 12:                        // '!'
    case 19:                        // '('
    case 24:                        // '++'
    case 28:                        // '--'
    case 47:                        // '['
    case 66:                        // '{'
    case 71:                        // '~'
      try_Operation();
      break;
    case 10:                        // Comment
      consumeT(10);                 // Comment
      break;
    default:
      try_Statement();
    }
  }

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
      case 68:                      // '|='
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 399:                   // '%=' Identifier
        case 402:                   // '&=' Identifier
        case 406:                   // '*=' Identifier
        case 409:                   // '+=' Identifier
        case 413:                   // '-=' Identifier
        case 417:                   // '/=' Identifier
        case 422:                   // '<<=' Identifier
        case 424:                   // '=' Identifier
        case 429:                   // '>>=' Identifier
        case 434:                   // '^=' Identifier
        case 452:                   // '|=' Identifier
          lookahead3W(26);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 6031:                  // '%=' '['
        case 6034:                  // '&=' '['
        case 6038:                  // '*=' '['
        case 6041:                  // '+=' '['
        case 6045:                  // '-=' '['
        case 6049:                  // '/=' '['
        case 6054:                  // '<<=' '['
        case 6056:                  // '=' '['
        case 6061:                  // '>>=' '['
        case 6066:                  // '^=' '['
        case 6084:                  // '|=' '['
          lookahead3W(14);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 2447:                  // '%=' '('
        case 8463:                  // '%=' '{'
        case 2450:                  // '&=' '('
        case 8466:                  // '&=' '{'
        case 2454:                  // '*=' '('
        case 8470:                  // '*=' '{'
        case 2457:                  // '+=' '('
        case 8473:                  // '+=' '{'
        case 2461:                  // '-=' '('
        case 8477:                  // '-=' '{'
        case 2465:                  // '/=' '('
        case 8481:                  // '/=' '{'
        case 2470:                  // '<<=' '('
        case 8486:                  // '<<=' '{'
        case 2472:                  // '=' '('
        case 8488:                  // '=' '{'
        case 2477:                  // '>>=' '('
        case 8493:                  // '>>=' '{'
        case 2482:                  // '^=' '('
        case 8498:                  // '^=' '{'
        case 2500:                  // '|=' '('
        case 8516:                  // '|=' '{'
          lookahead3W(11);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 1551:                  // '%=' '!'
        case 3087:                  // '%=' '++'
        case 3599:                  // '%=' '--'
        case 9103:                  // '%=' '~'
        case 1554:                  // '&=' '!'
        case 3090:                  // '&=' '++'
        case 3602:                  // '&=' '--'
        case 9106:                  // '&=' '~'
        case 1558:                  // '*=' '!'
        case 3094:                  // '*=' '++'
        case 3606:                  // '*=' '--'
        case 9110:                  // '*=' '~'
        case 1561:                  // '+=' '!'
        case 3097:                  // '+=' '++'
        case 3609:                  // '+=' '--'
        case 9113:                  // '+=' '~'
        case 1565:                  // '-=' '!'
        case 3101:                  // '-=' '++'
        case 3613:                  // '-=' '--'
        case 9117:                  // '-=' '~'
        case 1569:                  // '/=' '!'
        case 3105:                  // '/=' '++'
        case 3617:                  // '/=' '--'
        case 9121:                  // '/=' '~'
        case 1574:                  // '<<=' '!'
        case 3110:                  // '<<=' '++'
        case 3622:                  // '<<=' '--'
        case 9126:                  // '<<=' '~'
        case 1576:                  // '=' '!'
        case 3112:                  // '=' '++'
        case 3624:                  // '=' '--'
        case 9128:                  // '=' '~'
        case 1581:                  // '>>=' '!'
        case 3117:                  // '>>=' '++'
        case 3629:                  // '>>=' '--'
        case 9133:                  // '>>=' '~'
        case 1586:                  // '^=' '!'
        case 3122:                  // '^=' '++'
        case 3634:                  // '^=' '--'
        case 9138:                  // '^=' '~'
        case 1604:                  // '|=' '!'
        case 3140:                  // '|=' '++'
        case 3652:                  // '|=' '--'
        case 9156:                  // '|=' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 527:                   // '%=' Null
        case 655:                   // '%=' True
        case 783:                   // '%=' False
        case 911:                   // '%=' Character
        case 1039:                  // '%=' String
        case 1167:                  // '%=' Real
        case 530:                   // '&=' Null
        case 658:                   // '&=' True
        case 786:                   // '&=' False
        case 914:                   // '&=' Character
        case 1042:                  // '&=' String
        case 1170:                  // '&=' Real
        case 534:                   // '*=' Null
        case 662:                   // '*=' True
        case 790:                   // '*=' False
        case 918:                   // '*=' Character
        case 1046:                  // '*=' String
        case 1174:                  // '*=' Real
        case 537:                   // '+=' Null
        case 665:                   // '+=' True
        case 793:                   // '+=' False
        case 921:                   // '+=' Character
        case 1049:                  // '+=' String
        case 1177:                  // '+=' Real
        case 541:                   // '-=' Null
        case 669:                   // '-=' True
        case 797:                   // '-=' False
        case 925:                   // '-=' Character
        case 1053:                  // '-=' String
        case 1181:                  // '-=' Real
        case 545:                   // '/=' Null
        case 673:                   // '/=' True
        case 801:                   // '/=' False
        case 929:                   // '/=' Character
        case 1057:                  // '/=' String
        case 1185:                  // '/=' Real
        case 550:                   // '<<=' Null
        case 678:                   // '<<=' True
        case 806:                   // '<<=' False
        case 934:                   // '<<=' Character
        case 1062:                  // '<<=' String
        case 1190:                  // '<<=' Real
        case 552:                   // '=' Null
        case 680:                   // '=' True
        case 808:                   // '=' False
        case 936:                   // '=' Character
        case 1064:                  // '=' String
        case 1192:                  // '=' Real
        case 557:                   // '>>=' Null
        case 685:                   // '>>=' True
        case 813:                   // '>>=' False
        case 941:                   // '>>=' Character
        case 1069:                  // '>>=' String
        case 1197:                  // '>>=' Real
        case 562:                   // '^=' Null
        case 690:                   // '^=' True
        case 818:                   // '^=' False
        case 946:                   // '^=' Character
        case 1074:                  // '^=' String
        case 1202:                  // '^=' Real
        case 580:                   // '|=' Null
        case 708:                   // '|=' True
        case 836:                   // '|=' False
        case 964:                   // '|=' Character
        case 1092:                  // '|=' String
        case 1220:                  // '|=' Real
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
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
       && lk != 51                  // 'auto'
       && lk != 52                  // 'char'
       && lk != 53                  // 'const'
       && lk != 54                  // 'double'
       && lk != 55                  // 'extern'
       && lk != 56                  // 'float'
       && lk != 57                  // 'int'
       && lk != 58                  // 'long'
       && lk != 59                  // 'register'
       && lk != 60                  // 'short'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 64                  // 'void'
       && lk != 65                  // 'volatile'
       && lk != 66                  // '{'
       && lk != 70                  // '}'
       && lk != 71)                 // '~'
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
              consumeT(68);         // '|='
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
        consume(68);                // '|='
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
      case 68:                      // '|='
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 399:                   // '%=' Identifier
        case 402:                   // '&=' Identifier
        case 406:                   // '*=' Identifier
        case 409:                   // '+=' Identifier
        case 413:                   // '-=' Identifier
        case 417:                   // '/=' Identifier
        case 422:                   // '<<=' Identifier
        case 424:                   // '=' Identifier
        case 429:                   // '>>=' Identifier
        case 434:                   // '^=' Identifier
        case 452:                   // '|=' Identifier
          lookahead3W(26);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 6031:                  // '%=' '['
        case 6034:                  // '&=' '['
        case 6038:                  // '*=' '['
        case 6041:                  // '+=' '['
        case 6045:                  // '-=' '['
        case 6049:                  // '/=' '['
        case 6054:                  // '<<=' '['
        case 6056:                  // '=' '['
        case 6061:                  // '>>=' '['
        case 6066:                  // '^=' '['
        case 6084:                  // '|=' '['
          lookahead3W(14);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 2447:                  // '%=' '('
        case 8463:                  // '%=' '{'
        case 2450:                  // '&=' '('
        case 8466:                  // '&=' '{'
        case 2454:                  // '*=' '('
        case 8470:                  // '*=' '{'
        case 2457:                  // '+=' '('
        case 8473:                  // '+=' '{'
        case 2461:                  // '-=' '('
        case 8477:                  // '-=' '{'
        case 2465:                  // '/=' '('
        case 8481:                  // '/=' '{'
        case 2470:                  // '<<=' '('
        case 8486:                  // '<<=' '{'
        case 2472:                  // '=' '('
        case 8488:                  // '=' '{'
        case 2477:                  // '>>=' '('
        case 8493:                  // '>>=' '{'
        case 2482:                  // '^=' '('
        case 8498:                  // '^=' '{'
        case 2500:                  // '|=' '('
        case 8516:                  // '|=' '{'
          lookahead3W(11);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 1551:                  // '%=' '!'
        case 3087:                  // '%=' '++'
        case 3599:                  // '%=' '--'
        case 9103:                  // '%=' '~'
        case 1554:                  // '&=' '!'
        case 3090:                  // '&=' '++'
        case 3602:                  // '&=' '--'
        case 9106:                  // '&=' '~'
        case 1558:                  // '*=' '!'
        case 3094:                  // '*=' '++'
        case 3606:                  // '*=' '--'
        case 9110:                  // '*=' '~'
        case 1561:                  // '+=' '!'
        case 3097:                  // '+=' '++'
        case 3609:                  // '+=' '--'
        case 9113:                  // '+=' '~'
        case 1565:                  // '-=' '!'
        case 3101:                  // '-=' '++'
        case 3613:                  // '-=' '--'
        case 9117:                  // '-=' '~'
        case 1569:                  // '/=' '!'
        case 3105:                  // '/=' '++'
        case 3617:                  // '/=' '--'
        case 9121:                  // '/=' '~'
        case 1574:                  // '<<=' '!'
        case 3110:                  // '<<=' '++'
        case 3622:                  // '<<=' '--'
        case 9126:                  // '<<=' '~'
        case 1576:                  // '=' '!'
        case 3112:                  // '=' '++'
        case 3624:                  // '=' '--'
        case 9128:                  // '=' '~'
        case 1581:                  // '>>=' '!'
        case 3117:                  // '>>=' '++'
        case 3629:                  // '>>=' '--'
        case 9133:                  // '>>=' '~'
        case 1586:                  // '^=' '!'
        case 3122:                  // '^=' '++'
        case 3634:                  // '^=' '--'
        case 9138:                  // '^=' '~'
        case 1604:                  // '|=' '!'
        case 3140:                  // '|=' '++'
        case 3652:                  // '|=' '--'
        case 9156:                  // '|=' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 527:                   // '%=' Null
        case 655:                   // '%=' True
        case 783:                   // '%=' False
        case 911:                   // '%=' Character
        case 1039:                  // '%=' String
        case 1167:                  // '%=' Real
        case 530:                   // '&=' Null
        case 658:                   // '&=' True
        case 786:                   // '&=' False
        case 914:                   // '&=' Character
        case 1042:                  // '&=' String
        case 1170:                  // '&=' Real
        case 534:                   // '*=' Null
        case 662:                   // '*=' True
        case 790:                   // '*=' False
        case 918:                   // '*=' Character
        case 1046:                  // '*=' String
        case 1174:                  // '*=' Real
        case 537:                   // '+=' Null
        case 665:                   // '+=' True
        case 793:                   // '+=' False
        case 921:                   // '+=' Character
        case 1049:                  // '+=' String
        case 1177:                  // '+=' Real
        case 541:                   // '-=' Null
        case 669:                   // '-=' True
        case 797:                   // '-=' False
        case 925:                   // '-=' Character
        case 1053:                  // '-=' String
        case 1181:                  // '-=' Real
        case 545:                   // '/=' Null
        case 673:                   // '/=' True
        case 801:                   // '/=' False
        case 929:                   // '/=' Character
        case 1057:                  // '/=' String
        case 1185:                  // '/=' Real
        case 550:                   // '<<=' Null
        case 678:                   // '<<=' True
        case 806:                   // '<<=' False
        case 934:                   // '<<=' Character
        case 1062:                  // '<<=' String
        case 1190:                  // '<<=' Real
        case 552:                   // '=' Null
        case 680:                   // '=' True
        case 808:                   // '=' False
        case 936:                   // '=' Character
        case 1064:                  // '=' String
        case 1192:                  // '=' Real
        case 557:                   // '>>=' Null
        case 685:                   // '>>=' True
        case 813:                   // '>>=' False
        case 941:                   // '>>=' Character
        case 1069:                  // '>>=' String
        case 1197:                  // '>>=' Real
        case 562:                   // '^=' Null
        case 690:                   // '^=' True
        case 818:                   // '^=' False
        case 946:                   // '^=' Character
        case 1074:                  // '^=' String
        case 1202:                  // '^=' Real
        case 580:                   // '|=' Null
        case 708:                   // '|=' True
        case 836:                   // '|=' False
        case 964:                   // '|=' Character
        case 1092:                  // '|=' String
        case 1220:                  // '|=' Real
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
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
       && lk != 51                  // 'auto'
       && lk != 52                  // 'char'
       && lk != 53                  // 'const'
       && lk != 54                  // 'double'
       && lk != 55                  // 'extern'
       && lk != 56                  // 'float'
       && lk != 57                  // 'int'
       && lk != 58                  // 'long'
       && lk != 59                  // 'register'
       && lk != 60                  // 'short'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 64                  // 'void'
       && lk != 65                  // 'volatile'
       && lk != 66                  // '{'
       && lk != 70                  // '}'
       && lk != 71)                 // '~'
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
              consumeT(68);         // '|='
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
        consumeT(68);               // '|='
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
      if (l1 != 69)                 // '||'
      {
        break;
      }
      consume(69);                  // '||'
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
      if (l1 != 69)                 // '||'
      {
        break;
      }
      consumeT(69);                 // '||'
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
      if (l1 != 67)                 // '|'
      {
        break;
      }
      consume(67);                  // '|'
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
      if (l1 != 67)                 // '|'
      {
        break;
      }
      consumeT(67);                 // '|'
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
      lookahead1W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (l1)
      {
      case 49:                      // '^'
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 433:                   // '^' Identifier
          lookahead3W(26);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 6065:                  // '^' '['
          lookahead3W(14);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 2481:                  // '^' '('
        case 8497:                  // '^' '{'
          lookahead3W(11);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 1585:                  // '^' '!'
        case 3121:                  // '^' '++'
        case 3633:                  // '^' '--'
        case 9137:                  // '^' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 561:                   // '^' Null
        case 689:                   // '^' True
        case 817:                   // '^' False
        case 945:                   // '^' Character
        case 1073:                  // '^' String
        case 1201:                  // '^' Real
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
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
       && lk != 51                  // 'auto'
       && lk != 52                  // 'char'
       && lk != 53                  // 'const'
       && lk != 54                  // 'double'
       && lk != 55                  // 'extern'
       && lk != 56                  // 'float'
       && lk != 57                  // 'int'
       && lk != 58                  // 'long'
       && lk != 59                  // 'register'
       && lk != 60                  // 'short'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 64                  // 'void'
       && lk != 65                  // 'volatile'
       && lk != 66                  // '{'
       && lk != 67                  // '|'
       && lk != 68                  // '|='
       && lk != 69                  // '||'
       && lk != 70                  // '}'
       && lk != 71)                 // '~'
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
      lookahead1W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (l1)
      {
      case 49:                      // '^'
        lookahead2W(9);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '!' | '(' | '++' | '--' | '[' | '{' | '~'
        switch (lk)
        {
        case 433:                   // '^' Identifier
          lookahead3W(26);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
          break;
        case 6065:                  // '^' '['
          lookahead3W(14);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 2481:                  // '^' '('
        case 8497:                  // '^' '{'
          lookahead3W(11);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 1585:                  // '^' '!'
        case 3121:                  // '^' '++'
        case 3633:                  // '^' '--'
        case 9137:                  // '^' '~'
          lookahead3W(8);           // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
          break;
        case 561:                   // '^' Null
        case 689:                   // '^' True
        case 817:                   // '^' False
        case 945:                   // '^' Character
        case 1073:                  // '^' String
        case 1201:                  // '^' Real
          lookahead3W(25);          // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
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
       && lk != 51                  // 'auto'
       && lk != 52                  // 'char'
       && lk != 53                  // 'const'
       && lk != 54                  // 'double'
       && lk != 55                  // 'extern'
       && lk != 56                  // 'float'
       && lk != 57                  // 'int'
       && lk != 58                  // 'long'
       && lk != 59                  // 'register'
       && lk != 60                  // 'short'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 64                  // 'void'
       && lk != 65                  // 'volatile'
       && lk != 66                  // '{'
       && lk != 67                  // '|'
       && lk != 68                  // '|='
       && lk != 69                  // '||'
       && lk != 70                  // '}'
       && lk != 71)                 // '~'
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
      lookahead2W(26);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 2435:                    // Identifier '('
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 6019:                    // Identifier '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 3075:                    // Identifier '++'
      case 3587:                    // Identifier '--'
        lookahead3W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        break;
      case 3843:                    // Identifier '->'
      case 3971:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    case 19:                        // '('
      lookahead2W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 403:                     // '(' Identifier
        lookahead3W(22);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' | '^' |
                                    // '^=' | '|' | '|=' | '||'
        break;
      case 6035:                    // '(' '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 1299:                    // '(' Comment
      case 4499:                    // '(' ';'
        lookahead3W(1);             // WhiteSpace^token | ')'
        break;
      case 1555:                    // '(' '!'
      case 3091:                    // '(' '++'
      case 3603:                    // '(' '--'
      case 9107:                    // '(' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 531:                     // '(' Null
      case 659:                     // '(' True
      case 787:                     // '(' False
      case 915:                     // '(' Character
      case 1043:                    // '(' String
      case 1171:                    // '(' Real
        lookahead3W(17);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 6547:                    // '(' 'auto'
      case 6803:                    // '(' 'const'
      case 7059:                    // '(' 'extern'
      case 7571:                    // '(' 'register'
      case 7827:                    // '(' 'signed'
      case 7955:                    // '(' 'static'
      case 8083:                    // '(' 'unsigned'
      case 8339:                    // '(' 'volatile'
        lookahead3W(10);            // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
        break;
      case 2451:                    // '(' '('
      case 6675:                    // '(' 'char'
      case 6931:                    // '(' 'double'
      case 7187:                    // '(' 'float'
      case 7315:                    // '(' 'int'
      case 7443:                    // '(' 'long'
      case 7699:                    // '(' 'short'
      case 8211:                    // '(' 'void'
      case 8467:                    // '(' '{'
        lookahead3W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    case 47:                        // '['
      lookahead2W(14);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 431:                     // '[' Identifier
        lookahead3W(24);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 1327:                    // '[' Comment
        lookahead3W(7);             // WhiteSpace^token | ',' | ';' | ']'
        break;
      case 4527:                    // '[' ';'
        lookahead3W(16);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 6063:                    // '[' '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 6191:                    // '[' ']'
        lookahead3W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        break;
      case 1583:                    // '[' '!'
      case 3119:                    // '[' '++'
      case 3631:                    // '[' '--'
      case 9135:                    // '[' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 559:                     // '[' Null
      case 687:                     // '[' True
      case 815:                     // '[' False
      case 943:                     // '[' Character
      case 1071:                    // '[' String
      case 1199:                    // '[' Real
        lookahead3W(21);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
        break;
      case 6575:                    // '[' 'auto'
      case 6831:                    // '[' 'const'
      case 7087:                    // '[' 'extern'
      case 7599:                    // '[' 'register'
      case 7855:                    // '[' 'signed'
      case 7983:                    // '[' 'static'
      case 8111:                    // '[' 'unsigned'
      case 8367:                    // '[' 'volatile'
        lookahead3W(10);            // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
        break;
      case 2479:                    // '[' '('
      case 6703:                    // '[' 'char'
      case 6959:                    // '[' 'double'
      case 7215:                    // '[' 'float'
      case 7343:                    // '[' 'int'
      case 7471:                    // '[' 'long'
      case 7727:                    // '[' 'short'
      case 8239:                    // '[' 'void'
      case 8495:                    // '[' '{'
        lookahead3W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    case 66:                        // '{'
      lookahead2W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 450:                     // '{' Identifier
        lookahead3W(23);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
        break;
      case 1090:                    // '{' String
        lookahead3W(20);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
        break;
      case 6082:                    // '{' '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 1346:                    // '{' Comment
      case 4546:                    // '{' ';'
        lookahead3W(5);             // WhiteSpace^token | ',' | '}'
        break;
      case 1602:                    // '{' '!'
      case 3138:                    // '{' '++'
      case 3650:                    // '{' '--'
      case 9154:                    // '{' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 578:                     // '{' Null
      case 706:                     // '{' True
      case 834:                     // '{' False
      case 962:                     // '{' Character
      case 1218:                    // '{' Real
        lookahead3W(19);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||' |
                                    // '}'
        break;
      case 6594:                    // '{' 'auto'
      case 6850:                    // '{' 'const'
      case 7106:                    // '{' 'extern'
      case 7618:                    // '{' 'register'
      case 7874:                    // '{' 'signed'
      case 8002:                    // '{' 'static'
      case 8130:                    // '{' 'unsigned'
      case 8386:                    // '{' 'volatile'
        lookahead3W(10);            // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
        break;
      case 2498:                    // '{' '('
      case 6722:                    // '{' 'char'
      case 6978:                    // '{' 'double'
      case 7234:                    // '{' 'float'
      case 7362:                    // '{' 'int'
      case 7490:                    // '{' 'long'
      case 7746:                    // '{' 'short'
      case 8258:                    // '{' 'void'
      case 8514:                    // '{' '{'
        lookahead3W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    case 4:                         // Null
    case 5:                         // True
    case 6:                         // False
    case 7:                         // Character
    case 8:                         // String
    case 9:                         // Real
      lookahead2W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 3076:                    // Null '++'
      case 3588:                    // Null '--'
      case 3077:                    // True '++'
      case 3589:                    // True '--'
      case 3078:                    // False '++'
      case 3590:                    // False '--'
      case 3079:                    // Character '++'
      case 3591:                    // Character '--'
      case 3080:                    // String '++'
      case 3592:                    // String '--'
      case 3081:                    // Real '++'
      case 3593:                    // Real '--'
        lookahead3W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk != 12                    // '!'
     && lk != 24                    // '++'
     && lk != 28                    // '--'
     && lk != 71                    // '~'
     && lk != 131                   // Identifier END
     && lk != 132                   // Null END
     && lk != 133                   // True END
     && lk != 134                   // False END
     && lk != 135                   // Character END
     && lk != 136                   // String END
     && lk != 137                   // Real END
     && lk != 387                   // Identifier Identifier
     && lk != 388                   // Null Identifier
     && lk != 389                   // True Identifier
     && lk != 390                   // False Identifier
     && lk != 391                   // Character Identifier
     && lk != 392                   // String Identifier
     && lk != 393                   // Real Identifier
     && lk != 515                   // Identifier Null
     && lk != 516                   // Null Null
     && lk != 517                   // True Null
     && lk != 518                   // False Null
     && lk != 519                   // Character Null
     && lk != 520                   // String Null
     && lk != 521                   // Real Null
     && lk != 643                   // Identifier True
     && lk != 644                   // Null True
     && lk != 645                   // True True
     && lk != 646                   // False True
     && lk != 647                   // Character True
     && lk != 648                   // String True
     && lk != 649                   // Real True
     && lk != 771                   // Identifier False
     && lk != 772                   // Null False
     && lk != 773                   // True False
     && lk != 774                   // False False
     && lk != 775                   // Character False
     && lk != 776                   // String False
     && lk != 777                   // Real False
     && lk != 899                   // Identifier Character
     && lk != 900                   // Null Character
     && lk != 901                   // True Character
     && lk != 902                   // False Character
     && lk != 903                   // Character Character
     && lk != 904                   // String Character
     && lk != 905                   // Real Character
     && lk != 1027                  // Identifier String
     && lk != 1028                  // Null String
     && lk != 1029                  // True String
     && lk != 1030                  // False String
     && lk != 1031                  // Character String
     && lk != 1032                  // String String
     && lk != 1033                  // Real String
     && lk != 1155                  // Identifier Real
     && lk != 1156                  // Null Real
     && lk != 1157                  // True Real
     && lk != 1158                  // False Real
     && lk != 1159                  // Character Real
     && lk != 1160                  // String Real
     && lk != 1161                  // Real Real
     && lk != 1283                  // Identifier Comment
     && lk != 1284                  // Null Comment
     && lk != 1285                  // True Comment
     && lk != 1286                  // False Comment
     && lk != 1287                  // Character Comment
     && lk != 1288                  // String Comment
     && lk != 1289                  // Real Comment
     && lk != 1539                  // Identifier '!'
     && lk != 1540                  // Null '!'
     && lk != 1541                  // True '!'
     && lk != 1542                  // False '!'
     && lk != 1543                  // Character '!'
     && lk != 1544                  // String '!'
     && lk != 1545                  // Real '!'
     && lk != 1667                  // Identifier '!='
     && lk != 1668                  // Null '!='
     && lk != 1669                  // True '!='
     && lk != 1670                  // False '!='
     && lk != 1671                  // Character '!='
     && lk != 1672                  // String '!='
     && lk != 1673                  // Real '!='
     && lk != 1795                  // Identifier '%'
     && lk != 1796                  // Null '%'
     && lk != 1797                  // True '%'
     && lk != 1798                  // False '%'
     && lk != 1799                  // Character '%'
     && lk != 1800                  // String '%'
     && lk != 1801                  // Real '%'
     && lk != 1923                  // Identifier '%='
     && lk != 1924                  // Null '%='
     && lk != 1925                  // True '%='
     && lk != 1926                  // False '%='
     && lk != 1927                  // Character '%='
     && lk != 1928                  // String '%='
     && lk != 1929                  // Real '%='
     && lk != 2051                  // Identifier '&'
     && lk != 2052                  // Null '&'
     && lk != 2053                  // True '&'
     && lk != 2054                  // False '&'
     && lk != 2055                  // Character '&'
     && lk != 2056                  // String '&'
     && lk != 2057                  // Real '&'
     && lk != 2179                  // Identifier '&&'
     && lk != 2180                  // Null '&&'
     && lk != 2181                  // True '&&'
     && lk != 2182                  // False '&&'
     && lk != 2183                  // Character '&&'
     && lk != 2184                  // String '&&'
     && lk != 2185                  // Real '&&'
     && lk != 2307                  // Identifier '&='
     && lk != 2308                  // Null '&='
     && lk != 2309                  // True '&='
     && lk != 2310                  // False '&='
     && lk != 2311                  // Character '&='
     && lk != 2312                  // String '&='
     && lk != 2313                  // Real '&='
     && lk != 2436                  // Null '('
     && lk != 2437                  // True '('
     && lk != 2438                  // False '('
     && lk != 2439                  // Character '('
     && lk != 2440                  // String '('
     && lk != 2441                  // Real '('
     && lk != 2563                  // Identifier ')'
     && lk != 2564                  // Null ')'
     && lk != 2565                  // True ')'
     && lk != 2566                  // False ')'
     && lk != 2567                  // Character ')'
     && lk != 2568                  // String ')'
     && lk != 2569                  // Real ')'
     && lk != 2691                  // Identifier '*'
     && lk != 2692                  // Null '*'
     && lk != 2693                  // True '*'
     && lk != 2694                  // False '*'
     && lk != 2695                  // Character '*'
     && lk != 2696                  // String '*'
     && lk != 2697                  // Real '*'
     && lk != 2819                  // Identifier '*='
     && lk != 2820                  // Null '*='
     && lk != 2821                  // True '*='
     && lk != 2822                  // False '*='
     && lk != 2823                  // Character '*='
     && lk != 2824                  // String '*='
     && lk != 2825                  // Real '*='
     && lk != 2947                  // Identifier '+'
     && lk != 2948                  // Null '+'
     && lk != 2949                  // True '+'
     && lk != 2950                  // False '+'
     && lk != 2951                  // Character '+'
     && lk != 2952                  // String '+'
     && lk != 2953                  // Real '+'
     && lk != 3203                  // Identifier '+='
     && lk != 3204                  // Null '+='
     && lk != 3205                  // True '+='
     && lk != 3206                  // False '+='
     && lk != 3207                  // Character '+='
     && lk != 3208                  // String '+='
     && lk != 3209                  // Real '+='
     && lk != 3331                  // Identifier ','
     && lk != 3332                  // Null ','
     && lk != 3333                  // True ','
     && lk != 3334                  // False ','
     && lk != 3335                  // Character ','
     && lk != 3336                  // String ','
     && lk != 3337                  // Real ','
     && lk != 3459                  // Identifier '-'
     && lk != 3460                  // Null '-'
     && lk != 3461                  // True '-'
     && lk != 3462                  // False '-'
     && lk != 3463                  // Character '-'
     && lk != 3464                  // String '-'
     && lk != 3465                  // Real '-'
     && lk != 3715                  // Identifier '-='
     && lk != 3716                  // Null '-='
     && lk != 3717                  // True '-='
     && lk != 3718                  // False '-='
     && lk != 3719                  // Character '-='
     && lk != 3720                  // String '-='
     && lk != 3721                  // Real '-='
     && lk != 4099                  // Identifier '/'
     && lk != 4100                  // Null '/'
     && lk != 4101                  // True '/'
     && lk != 4102                  // False '/'
     && lk != 4103                  // Character '/'
     && lk != 4104                  // String '/'
     && lk != 4105                  // Real '/'
     && lk != 4227                  // Identifier '/='
     && lk != 4228                  // Null '/='
     && lk != 4229                  // True '/='
     && lk != 4230                  // False '/='
     && lk != 4231                  // Character '/='
     && lk != 4232                  // String '/='
     && lk != 4233                  // Real '/='
     && lk != 4355                  // Identifier ':'
     && lk != 4356                  // Null ':'
     && lk != 4357                  // True ':'
     && lk != 4358                  // False ':'
     && lk != 4359                  // Character ':'
     && lk != 4360                  // String ':'
     && lk != 4361                  // Real ':'
     && lk != 4483                  // Identifier ';'
     && lk != 4484                  // Null ';'
     && lk != 4485                  // True ';'
     && lk != 4486                  // False ';'
     && lk != 4487                  // Character ';'
     && lk != 4488                  // String ';'
     && lk != 4489                  // Real ';'
     && lk != 4611                  // Identifier '<'
     && lk != 4612                  // Null '<'
     && lk != 4613                  // True '<'
     && lk != 4614                  // False '<'
     && lk != 4615                  // Character '<'
     && lk != 4616                  // String '<'
     && lk != 4617                  // Real '<'
     && lk != 4739                  // Identifier '<<'
     && lk != 4740                  // Null '<<'
     && lk != 4741                  // True '<<'
     && lk != 4742                  // False '<<'
     && lk != 4743                  // Character '<<'
     && lk != 4744                  // String '<<'
     && lk != 4745                  // Real '<<'
     && lk != 4867                  // Identifier '<<='
     && lk != 4868                  // Null '<<='
     && lk != 4869                  // True '<<='
     && lk != 4870                  // False '<<='
     && lk != 4871                  // Character '<<='
     && lk != 4872                  // String '<<='
     && lk != 4873                  // Real '<<='
     && lk != 4995                  // Identifier '<='
     && lk != 4996                  // Null '<='
     && lk != 4997                  // True '<='
     && lk != 4998                  // False '<='
     && lk != 4999                  // Character '<='
     && lk != 5000                  // String '<='
     && lk != 5001                  // Real '<='
     && lk != 5123                  // Identifier '='
     && lk != 5124                  // Null '='
     && lk != 5125                  // True '='
     && lk != 5126                  // False '='
     && lk != 5127                  // Character '='
     && lk != 5128                  // String '='
     && lk != 5129                  // Real '='
     && lk != 5251                  // Identifier '=='
     && lk != 5252                  // Null '=='
     && lk != 5253                  // True '=='
     && lk != 5254                  // False '=='
     && lk != 5255                  // Character '=='
     && lk != 5256                  // String '=='
     && lk != 5257                  // Real '=='
     && lk != 5379                  // Identifier '>'
     && lk != 5380                  // Null '>'
     && lk != 5381                  // True '>'
     && lk != 5382                  // False '>'
     && lk != 5383                  // Character '>'
     && lk != 5384                  // String '>'
     && lk != 5385                  // Real '>'
     && lk != 5507                  // Identifier '>='
     && lk != 5508                  // Null '>='
     && lk != 5509                  // True '>='
     && lk != 5510                  // False '>='
     && lk != 5511                  // Character '>='
     && lk != 5512                  // String '>='
     && lk != 5513                  // Real '>='
     && lk != 5635                  // Identifier '>>'
     && lk != 5636                  // Null '>>'
     && lk != 5637                  // True '>>'
     && lk != 5638                  // False '>>'
     && lk != 5639                  // Character '>>'
     && lk != 5640                  // String '>>'
     && lk != 5641                  // Real '>>'
     && lk != 5763                  // Identifier '>>='
     && lk != 5764                  // Null '>>='
     && lk != 5765                  // True '>>='
     && lk != 5766                  // False '>>='
     && lk != 5767                  // Character '>>='
     && lk != 5768                  // String '>>='
     && lk != 5769                  // Real '>>='
     && lk != 5891                  // Identifier '?'
     && lk != 5892                  // Null '?'
     && lk != 5893                  // True '?'
     && lk != 5894                  // False '?'
     && lk != 5895                  // Character '?'
     && lk != 5896                  // String '?'
     && lk != 5897                  // Real '?'
     && lk != 6020                  // Null '['
     && lk != 6021                  // True '['
     && lk != 6022                  // False '['
     && lk != 6023                  // Character '['
     && lk != 6024                  // String '['
     && lk != 6025                  // Real '['
     && lk != 6147                  // Identifier ']'
     && lk != 6148                  // Null ']'
     && lk != 6149                  // True ']'
     && lk != 6150                  // False ']'
     && lk != 6151                  // Character ']'
     && lk != 6152                  // String ']'
     && lk != 6153                  // Real ']'
     && lk != 6275                  // Identifier '^'
     && lk != 6276                  // Null '^'
     && lk != 6277                  // True '^'
     && lk != 6278                  // False '^'
     && lk != 6279                  // Character '^'
     && lk != 6280                  // String '^'
     && lk != 6281                  // Real '^'
     && lk != 6403                  // Identifier '^='
     && lk != 6404                  // Null '^='
     && lk != 6405                  // True '^='
     && lk != 6406                  // False '^='
     && lk != 6407                  // Character '^='
     && lk != 6408                  // String '^='
     && lk != 6409                  // Real '^='
     && lk != 6531                  // Identifier 'auto'
     && lk != 6532                  // Null 'auto'
     && lk != 6533                  // True 'auto'
     && lk != 6534                  // False 'auto'
     && lk != 6535                  // Character 'auto'
     && lk != 6536                  // String 'auto'
     && lk != 6537                  // Real 'auto'
     && lk != 6659                  // Identifier 'char'
     && lk != 6660                  // Null 'char'
     && lk != 6661                  // True 'char'
     && lk != 6662                  // False 'char'
     && lk != 6663                  // Character 'char'
     && lk != 6664                  // String 'char'
     && lk != 6665                  // Real 'char'
     && lk != 6787                  // Identifier 'const'
     && lk != 6788                  // Null 'const'
     && lk != 6789                  // True 'const'
     && lk != 6790                  // False 'const'
     && lk != 6791                  // Character 'const'
     && lk != 6792                  // String 'const'
     && lk != 6793                  // Real 'const'
     && lk != 6915                  // Identifier 'double'
     && lk != 6916                  // Null 'double'
     && lk != 6917                  // True 'double'
     && lk != 6918                  // False 'double'
     && lk != 6919                  // Character 'double'
     && lk != 6920                  // String 'double'
     && lk != 6921                  // Real 'double'
     && lk != 7043                  // Identifier 'extern'
     && lk != 7044                  // Null 'extern'
     && lk != 7045                  // True 'extern'
     && lk != 7046                  // False 'extern'
     && lk != 7047                  // Character 'extern'
     && lk != 7048                  // String 'extern'
     && lk != 7049                  // Real 'extern'
     && lk != 7171                  // Identifier 'float'
     && lk != 7172                  // Null 'float'
     && lk != 7173                  // True 'float'
     && lk != 7174                  // False 'float'
     && lk != 7175                  // Character 'float'
     && lk != 7176                  // String 'float'
     && lk != 7177                  // Real 'float'
     && lk != 7299                  // Identifier 'int'
     && lk != 7300                  // Null 'int'
     && lk != 7301                  // True 'int'
     && lk != 7302                  // False 'int'
     && lk != 7303                  // Character 'int'
     && lk != 7304                  // String 'int'
     && lk != 7305                  // Real 'int'
     && lk != 7427                  // Identifier 'long'
     && lk != 7428                  // Null 'long'
     && lk != 7429                  // True 'long'
     && lk != 7430                  // False 'long'
     && lk != 7431                  // Character 'long'
     && lk != 7432                  // String 'long'
     && lk != 7433                  // Real 'long'
     && lk != 7555                  // Identifier 'register'
     && lk != 7556                  // Null 'register'
     && lk != 7557                  // True 'register'
     && lk != 7558                  // False 'register'
     && lk != 7559                  // Character 'register'
     && lk != 7560                  // String 'register'
     && lk != 7561                  // Real 'register'
     && lk != 7683                  // Identifier 'short'
     && lk != 7684                  // Null 'short'
     && lk != 7685                  // True 'short'
     && lk != 7686                  // False 'short'
     && lk != 7687                  // Character 'short'
     && lk != 7688                  // String 'short'
     && lk != 7689                  // Real 'short'
     && lk != 7811                  // Identifier 'signed'
     && lk != 7812                  // Null 'signed'
     && lk != 7813                  // True 'signed'
     && lk != 7814                  // False 'signed'
     && lk != 7815                  // Character 'signed'
     && lk != 7816                  // String 'signed'
     && lk != 7817                  // Real 'signed'
     && lk != 7939                  // Identifier 'static'
     && lk != 7940                  // Null 'static'
     && lk != 7941                  // True 'static'
     && lk != 7942                  // False 'static'
     && lk != 7943                  // Character 'static'
     && lk != 7944                  // String 'static'
     && lk != 7945                  // Real 'static'
     && lk != 8067                  // Identifier 'unsigned'
     && lk != 8068                  // Null 'unsigned'
     && lk != 8069                  // True 'unsigned'
     && lk != 8070                  // False 'unsigned'
     && lk != 8071                  // Character 'unsigned'
     && lk != 8072                  // String 'unsigned'
     && lk != 8073                  // Real 'unsigned'
     && lk != 8195                  // Identifier 'void'
     && lk != 8196                  // Null 'void'
     && lk != 8197                  // True 'void'
     && lk != 8198                  // False 'void'
     && lk != 8199                  // Character 'void'
     && lk != 8200                  // String 'void'
     && lk != 8201                  // Real 'void'
     && lk != 8323                  // Identifier 'volatile'
     && lk != 8324                  // Null 'volatile'
     && lk != 8325                  // True 'volatile'
     && lk != 8326                  // False 'volatile'
     && lk != 8327                  // Character 'volatile'
     && lk != 8328                  // String 'volatile'
     && lk != 8329                  // Real 'volatile'
     && lk != 8451                  // Identifier '{'
     && lk != 8452                  // Null '{'
     && lk != 8453                  // True '{'
     && lk != 8454                  // False '{'
     && lk != 8455                  // Character '{'
     && lk != 8456                  // String '{'
     && lk != 8457                  // Real '{'
     && lk != 8579                  // Identifier '|'
     && lk != 8580                  // Null '|'
     && lk != 8581                  // True '|'
     && lk != 8582                  // False '|'
     && lk != 8583                  // Character '|'
     && lk != 8584                  // String '|'
     && lk != 8585                  // Real '|'
     && lk != 8707                  // Identifier '|='
     && lk != 8708                  // Null '|='
     && lk != 8709                  // True '|='
     && lk != 8710                  // False '|='
     && lk != 8711                  // Character '|='
     && lk != 8712                  // String '|='
     && lk != 8713                  // Real '|='
     && lk != 8835                  // Identifier '||'
     && lk != 8836                  // Null '||'
     && lk != 8837                  // True '||'
     && lk != 8838                  // False '||'
     && lk != 8839                  // Character '||'
     && lk != 8840                  // String '||'
     && lk != 8841                  // Real '||'
     && lk != 8963                  // Identifier '}'
     && lk != 8964                  // Null '}'
     && lk != 8965                  // True '}'
     && lk != 8966                  // False '}'
     && lk != 8967                  // Character '}'
     && lk != 8968                  // String '}'
     && lk != 8969                  // Real '}'
     && lk != 9091                  // Identifier '~'
     && lk != 9092                  // Null '~'
     && lk != 9093                  // True '~'
     && lk != 9094                  // False '~'
     && lk != 9095                  // Character '~'
     && lk != 9096                  // String '~'
     && lk != 9097                  // Real '~'
     && lk != 19459                 // Identifier '++' END
     && lk != 19460                 // Null '++' END
     && lk != 19461                 // True '++' END
     && lk != 19462                 // False '++' END
     && lk != 19463                 // Character '++' END
     && lk != 19464                 // String '++' END
     && lk != 19465                 // Real '++' END
     && lk != 19971                 // Identifier '--' END
     && lk != 19972                 // Null '--' END
     && lk != 19973                 // True '--' END
     && lk != 19974                 // False '--' END
     && lk != 19975                 // Character '--' END
     && lk != 19976                 // String '--' END
     && lk != 19977                 // Real '--' END
     && lk != 22575                 // '[' ']' END
     && lk != 55343                 // '[' ']' Identifier
     && lk != 71727                 // '[' ']' Null
     && lk != 88111                 // '[' ']' True
     && lk != 104495                // '[' ']' False
     && lk != 120879                // '[' ']' Character
     && lk != 137263                // '[' ']' String
     && lk != 153647                // '[' ']' Real
     && lk != 166915                // Identifier '++' Comment
     && lk != 166916                // Null '++' Comment
     && lk != 166917                // True '++' Comment
     && lk != 166918                // False '++' Comment
     && lk != 166919                // Character '++' Comment
     && lk != 166920                // String '++' Comment
     && lk != 166921                // Real '++' Comment
     && lk != 167427                // Identifier '--' Comment
     && lk != 167428                // Null '--' Comment
     && lk != 167429                // True '--' Comment
     && lk != 167430                // False '--' Comment
     && lk != 167431                // Character '--' Comment
     && lk != 167432                // String '--' Comment
     && lk != 167433                // Real '--' Comment
     && lk != 170031                // '[' ']' Comment
     && lk != 199683                // Identifier '++' '!'
     && lk != 199684                // Null '++' '!'
     && lk != 199685                // True '++' '!'
     && lk != 199686                // False '++' '!'
     && lk != 199687                // Character '++' '!'
     && lk != 199688                // String '++' '!'
     && lk != 199689                // Real '++' '!'
     && lk != 200195                // Identifier '--' '!'
     && lk != 200196                // Null '--' '!'
     && lk != 200197                // True '--' '!'
     && lk != 200198                // False '--' '!'
     && lk != 200199                // Character '--' '!'
     && lk != 200200                // String '--' '!'
     && lk != 200201                // Real '--' '!'
     && lk != 202799                // '[' ']' '!'
     && lk != 216067                // Identifier '++' '!='
     && lk != 216068                // Null '++' '!='
     && lk != 216069                // True '++' '!='
     && lk != 216070                // False '++' '!='
     && lk != 216071                // Character '++' '!='
     && lk != 216072                // String '++' '!='
     && lk != 216073                // Real '++' '!='
     && lk != 216579                // Identifier '--' '!='
     && lk != 216580                // Null '--' '!='
     && lk != 216581                // True '--' '!='
     && lk != 216582                // False '--' '!='
     && lk != 216583                // Character '--' '!='
     && lk != 216584                // String '--' '!='
     && lk != 216585                // Real '--' '!='
     && lk != 219183                // '[' ']' '!='
     && lk != 232451                // Identifier '++' '%'
     && lk != 232452                // Null '++' '%'
     && lk != 232453                // True '++' '%'
     && lk != 232454                // False '++' '%'
     && lk != 232455                // Character '++' '%'
     && lk != 232456                // String '++' '%'
     && lk != 232457                // Real '++' '%'
     && lk != 232963                // Identifier '--' '%'
     && lk != 232964                // Null '--' '%'
     && lk != 232965                // True '--' '%'
     && lk != 232966                // False '--' '%'
     && lk != 232967                // Character '--' '%'
     && lk != 232968                // String '--' '%'
     && lk != 232969                // Real '--' '%'
     && lk != 235567                // '[' ']' '%'
     && lk != 248835                // Identifier '++' '%='
     && lk != 248836                // Null '++' '%='
     && lk != 248837                // True '++' '%='
     && lk != 248838                // False '++' '%='
     && lk != 248839                // Character '++' '%='
     && lk != 248840                // String '++' '%='
     && lk != 248841                // Real '++' '%='
     && lk != 249347                // Identifier '--' '%='
     && lk != 249348                // Null '--' '%='
     && lk != 249349                // True '--' '%='
     && lk != 249350                // False '--' '%='
     && lk != 249351                // Character '--' '%='
     && lk != 249352                // String '--' '%='
     && lk != 249353                // Real '--' '%='
     && lk != 251951                // '[' ']' '%='
     && lk != 265219                // Identifier '++' '&'
     && lk != 265220                // Null '++' '&'
     && lk != 265221                // True '++' '&'
     && lk != 265222                // False '++' '&'
     && lk != 265223                // Character '++' '&'
     && lk != 265224                // String '++' '&'
     && lk != 265225                // Real '++' '&'
     && lk != 265731                // Identifier '--' '&'
     && lk != 265732                // Null '--' '&'
     && lk != 265733                // True '--' '&'
     && lk != 265734                // False '--' '&'
     && lk != 265735                // Character '--' '&'
     && lk != 265736                // String '--' '&'
     && lk != 265737                // Real '--' '&'
     && lk != 268335                // '[' ']' '&'
     && lk != 281603                // Identifier '++' '&&'
     && lk != 281604                // Null '++' '&&'
     && lk != 281605                // True '++' '&&'
     && lk != 281606                // False '++' '&&'
     && lk != 281607                // Character '++' '&&'
     && lk != 281608                // String '++' '&&'
     && lk != 281609                // Real '++' '&&'
     && lk != 282115                // Identifier '--' '&&'
     && lk != 282116                // Null '--' '&&'
     && lk != 282117                // True '--' '&&'
     && lk != 282118                // False '--' '&&'
     && lk != 282119                // Character '--' '&&'
     && lk != 282120                // String '--' '&&'
     && lk != 282121                // Real '--' '&&'
     && lk != 284719                // '[' ']' '&&'
     && lk != 297987                // Identifier '++' '&='
     && lk != 297988                // Null '++' '&='
     && lk != 297989                // True '++' '&='
     && lk != 297990                // False '++' '&='
     && lk != 297991                // Character '++' '&='
     && lk != 297992                // String '++' '&='
     && lk != 297993                // Real '++' '&='
     && lk != 298499                // Identifier '--' '&='
     && lk != 298500                // Null '--' '&='
     && lk != 298501                // True '--' '&='
     && lk != 298502                // False '--' '&='
     && lk != 298503                // Character '--' '&='
     && lk != 298504                // String '--' '&='
     && lk != 298505                // Real '--' '&='
     && lk != 301103                // '[' ']' '&='
     && lk != 317487                // '[' ']' '('
     && lk != 330755                // Identifier '++' ')'
     && lk != 330756                // Null '++' ')'
     && lk != 330757                // True '++' ')'
     && lk != 330758                // False '++' ')'
     && lk != 330759                // Character '++' ')'
     && lk != 330760                // String '++' ')'
     && lk != 330761                // Real '++' ')'
     && lk != 331267                // Identifier '--' ')'
     && lk != 331268                // Null '--' ')'
     && lk != 331269                // True '--' ')'
     && lk != 331270                // False '--' ')'
     && lk != 331271                // Character '--' ')'
     && lk != 331272                // String '--' ')'
     && lk != 331273                // Real '--' ')'
     && lk != 333871                // '[' ']' ')'
     && lk != 347139                // Identifier '++' '*'
     && lk != 347140                // Null '++' '*'
     && lk != 347141                // True '++' '*'
     && lk != 347142                // False '++' '*'
     && lk != 347143                // Character '++' '*'
     && lk != 347144                // String '++' '*'
     && lk != 347145                // Real '++' '*'
     && lk != 347651                // Identifier '--' '*'
     && lk != 347652                // Null '--' '*'
     && lk != 347653                // True '--' '*'
     && lk != 347654                // False '--' '*'
     && lk != 347655                // Character '--' '*'
     && lk != 347656                // String '--' '*'
     && lk != 347657                // Real '--' '*'
     && lk != 350255                // '[' ']' '*'
     && lk != 363523                // Identifier '++' '*='
     && lk != 363524                // Null '++' '*='
     && lk != 363525                // True '++' '*='
     && lk != 363526                // False '++' '*='
     && lk != 363527                // Character '++' '*='
     && lk != 363528                // String '++' '*='
     && lk != 363529                // Real '++' '*='
     && lk != 364035                // Identifier '--' '*='
     && lk != 364036                // Null '--' '*='
     && lk != 364037                // True '--' '*='
     && lk != 364038                // False '--' '*='
     && lk != 364039                // Character '--' '*='
     && lk != 364040                // String '--' '*='
     && lk != 364041                // Real '--' '*='
     && lk != 366639                // '[' ']' '*='
     && lk != 379907                // Identifier '++' '+'
     && lk != 379908                // Null '++' '+'
     && lk != 379909                // True '++' '+'
     && lk != 379910                // False '++' '+'
     && lk != 379911                // Character '++' '+'
     && lk != 379912                // String '++' '+'
     && lk != 379913                // Real '++' '+'
     && lk != 380419                // Identifier '--' '+'
     && lk != 380420                // Null '--' '+'
     && lk != 380421                // True '--' '+'
     && lk != 380422                // False '--' '+'
     && lk != 380423                // Character '--' '+'
     && lk != 380424                // String '--' '+'
     && lk != 380425                // Real '--' '+'
     && lk != 383023                // '[' ']' '+'
     && lk != 396291                // Identifier '++' '++'
     && lk != 396292                // Null '++' '++'
     && lk != 396293                // True '++' '++'
     && lk != 396294                // False '++' '++'
     && lk != 396295                // Character '++' '++'
     && lk != 396296                // String '++' '++'
     && lk != 396297                // Real '++' '++'
     && lk != 396803                // Identifier '--' '++'
     && lk != 396804                // Null '--' '++'
     && lk != 396805                // True '--' '++'
     && lk != 396806                // False '--' '++'
     && lk != 396807                // Character '--' '++'
     && lk != 396808                // String '--' '++'
     && lk != 396809                // Real '--' '++'
     && lk != 412675                // Identifier '++' '+='
     && lk != 412676                // Null '++' '+='
     && lk != 412677                // True '++' '+='
     && lk != 412678                // False '++' '+='
     && lk != 412679                // Character '++' '+='
     && lk != 412680                // String '++' '+='
     && lk != 412681                // Real '++' '+='
     && lk != 413187                // Identifier '--' '+='
     && lk != 413188                // Null '--' '+='
     && lk != 413189                // True '--' '+='
     && lk != 413190                // False '--' '+='
     && lk != 413191                // Character '--' '+='
     && lk != 413192                // String '--' '+='
     && lk != 413193                // Real '--' '+='
     && lk != 415791                // '[' ']' '+='
     && lk != 429059                // Identifier '++' ','
     && lk != 429060                // Null '++' ','
     && lk != 429061                // True '++' ','
     && lk != 429062                // False '++' ','
     && lk != 429063                // Character '++' ','
     && lk != 429064                // String '++' ','
     && lk != 429065                // Real '++' ','
     && lk != 429571                // Identifier '--' ','
     && lk != 429572                // Null '--' ','
     && lk != 429573                // True '--' ','
     && lk != 429574                // False '--' ','
     && lk != 429575                // Character '--' ','
     && lk != 429576                // String '--' ','
     && lk != 429577                // Real '--' ','
     && lk != 432175                // '[' ']' ','
     && lk != 445443                // Identifier '++' '-'
     && lk != 445444                // Null '++' '-'
     && lk != 445445                // True '++' '-'
     && lk != 445446                // False '++' '-'
     && lk != 445447                // Character '++' '-'
     && lk != 445448                // String '++' '-'
     && lk != 445449                // Real '++' '-'
     && lk != 445955                // Identifier '--' '-'
     && lk != 445956                // Null '--' '-'
     && lk != 445957                // True '--' '-'
     && lk != 445958                // False '--' '-'
     && lk != 445959                // Character '--' '-'
     && lk != 445960                // String '--' '-'
     && lk != 445961                // Real '--' '-'
     && lk != 448559                // '[' ']' '-'
     && lk != 461827                // Identifier '++' '--'
     && lk != 461828                // Null '++' '--'
     && lk != 461829                // True '++' '--'
     && lk != 461830                // False '++' '--'
     && lk != 461831                // Character '++' '--'
     && lk != 461832                // String '++' '--'
     && lk != 461833                // Real '++' '--'
     && lk != 462339                // Identifier '--' '--'
     && lk != 462340                // Null '--' '--'
     && lk != 462341                // True '--' '--'
     && lk != 462342                // False '--' '--'
     && lk != 462343                // Character '--' '--'
     && lk != 462344                // String '--' '--'
     && lk != 462345                // Real '--' '--'
     && lk != 478211                // Identifier '++' '-='
     && lk != 478212                // Null '++' '-='
     && lk != 478213                // True '++' '-='
     && lk != 478214                // False '++' '-='
     && lk != 478215                // Character '++' '-='
     && lk != 478216                // String '++' '-='
     && lk != 478217                // Real '++' '-='
     && lk != 478723                // Identifier '--' '-='
     && lk != 478724                // Null '--' '-='
     && lk != 478725                // True '--' '-='
     && lk != 478726                // False '--' '-='
     && lk != 478727                // Character '--' '-='
     && lk != 478728                // String '--' '-='
     && lk != 478729                // Real '--' '-='
     && lk != 481327                // '[' ']' '-='
     && lk != 527363                // Identifier '++' '/'
     && lk != 527364                // Null '++' '/'
     && lk != 527365                // True '++' '/'
     && lk != 527366                // False '++' '/'
     && lk != 527367                // Character '++' '/'
     && lk != 527368                // String '++' '/'
     && lk != 527369                // Real '++' '/'
     && lk != 527875                // Identifier '--' '/'
     && lk != 527876                // Null '--' '/'
     && lk != 527877                // True '--' '/'
     && lk != 527878                // False '--' '/'
     && lk != 527879                // Character '--' '/'
     && lk != 527880                // String '--' '/'
     && lk != 527881                // Real '--' '/'
     && lk != 530479                // '[' ']' '/'
     && lk != 543747                // Identifier '++' '/='
     && lk != 543748                // Null '++' '/='
     && lk != 543749                // True '++' '/='
     && lk != 543750                // False '++' '/='
     && lk != 543751                // Character '++' '/='
     && lk != 543752                // String '++' '/='
     && lk != 543753                // Real '++' '/='
     && lk != 544259                // Identifier '--' '/='
     && lk != 544260                // Null '--' '/='
     && lk != 544261                // True '--' '/='
     && lk != 544262                // False '--' '/='
     && lk != 544263                // Character '--' '/='
     && lk != 544264                // String '--' '/='
     && lk != 544265                // Real '--' '/='
     && lk != 546863                // '[' ']' '/='
     && lk != 560131                // Identifier '++' ':'
     && lk != 560132                // Null '++' ':'
     && lk != 560133                // True '++' ':'
     && lk != 560134                // False '++' ':'
     && lk != 560135                // Character '++' ':'
     && lk != 560136                // String '++' ':'
     && lk != 560137                // Real '++' ':'
     && lk != 560643                // Identifier '--' ':'
     && lk != 560644                // Null '--' ':'
     && lk != 560645                // True '--' ':'
     && lk != 560646                // False '--' ':'
     && lk != 560647                // Character '--' ':'
     && lk != 560648                // String '--' ':'
     && lk != 560649                // Real '--' ':'
     && lk != 563247                // '[' ']' ':'
     && lk != 576515                // Identifier '++' ';'
     && lk != 576516                // Null '++' ';'
     && lk != 576517                // True '++' ';'
     && lk != 576518                // False '++' ';'
     && lk != 576519                // Character '++' ';'
     && lk != 576520                // String '++' ';'
     && lk != 576521                // Real '++' ';'
     && lk != 577027                // Identifier '--' ';'
     && lk != 577028                // Null '--' ';'
     && lk != 577029                // True '--' ';'
     && lk != 577030                // False '--' ';'
     && lk != 577031                // Character '--' ';'
     && lk != 577032                // String '--' ';'
     && lk != 577033                // Real '--' ';'
     && lk != 579631                // '[' ']' ';'
     && lk != 592899                // Identifier '++' '<'
     && lk != 592900                // Null '++' '<'
     && lk != 592901                // True '++' '<'
     && lk != 592902                // False '++' '<'
     && lk != 592903                // Character '++' '<'
     && lk != 592904                // String '++' '<'
     && lk != 592905                // Real '++' '<'
     && lk != 593411                // Identifier '--' '<'
     && lk != 593412                // Null '--' '<'
     && lk != 593413                // True '--' '<'
     && lk != 593414                // False '--' '<'
     && lk != 593415                // Character '--' '<'
     && lk != 593416                // String '--' '<'
     && lk != 593417                // Real '--' '<'
     && lk != 596015                // '[' ']' '<'
     && lk != 609283                // Identifier '++' '<<'
     && lk != 609284                // Null '++' '<<'
     && lk != 609285                // True '++' '<<'
     && lk != 609286                // False '++' '<<'
     && lk != 609287                // Character '++' '<<'
     && lk != 609288                // String '++' '<<'
     && lk != 609289                // Real '++' '<<'
     && lk != 609795                // Identifier '--' '<<'
     && lk != 609796                // Null '--' '<<'
     && lk != 609797                // True '--' '<<'
     && lk != 609798                // False '--' '<<'
     && lk != 609799                // Character '--' '<<'
     && lk != 609800                // String '--' '<<'
     && lk != 609801                // Real '--' '<<'
     && lk != 612399                // '[' ']' '<<'
     && lk != 625667                // Identifier '++' '<<='
     && lk != 625668                // Null '++' '<<='
     && lk != 625669                // True '++' '<<='
     && lk != 625670                // False '++' '<<='
     && lk != 625671                // Character '++' '<<='
     && lk != 625672                // String '++' '<<='
     && lk != 625673                // Real '++' '<<='
     && lk != 626179                // Identifier '--' '<<='
     && lk != 626180                // Null '--' '<<='
     && lk != 626181                // True '--' '<<='
     && lk != 626182                // False '--' '<<='
     && lk != 626183                // Character '--' '<<='
     && lk != 626184                // String '--' '<<='
     && lk != 626185                // Real '--' '<<='
     && lk != 628783                // '[' ']' '<<='
     && lk != 642051                // Identifier '++' '<='
     && lk != 642052                // Null '++' '<='
     && lk != 642053                // True '++' '<='
     && lk != 642054                // False '++' '<='
     && lk != 642055                // Character '++' '<='
     && lk != 642056                // String '++' '<='
     && lk != 642057                // Real '++' '<='
     && lk != 642563                // Identifier '--' '<='
     && lk != 642564                // Null '--' '<='
     && lk != 642565                // True '--' '<='
     && lk != 642566                // False '--' '<='
     && lk != 642567                // Character '--' '<='
     && lk != 642568                // String '--' '<='
     && lk != 642569                // Real '--' '<='
     && lk != 645167                // '[' ']' '<='
     && lk != 658435                // Identifier '++' '='
     && lk != 658436                // Null '++' '='
     && lk != 658437                // True '++' '='
     && lk != 658438                // False '++' '='
     && lk != 658439                // Character '++' '='
     && lk != 658440                // String '++' '='
     && lk != 658441                // Real '++' '='
     && lk != 658947                // Identifier '--' '='
     && lk != 658948                // Null '--' '='
     && lk != 658949                // True '--' '='
     && lk != 658950                // False '--' '='
     && lk != 658951                // Character '--' '='
     && lk != 658952                // String '--' '='
     && lk != 658953                // Real '--' '='
     && lk != 661551                // '[' ']' '='
     && lk != 674819                // Identifier '++' '=='
     && lk != 674820                // Null '++' '=='
     && lk != 674821                // True '++' '=='
     && lk != 674822                // False '++' '=='
     && lk != 674823                // Character '++' '=='
     && lk != 674824                // String '++' '=='
     && lk != 674825                // Real '++' '=='
     && lk != 675331                // Identifier '--' '=='
     && lk != 675332                // Null '--' '=='
     && lk != 675333                // True '--' '=='
     && lk != 675334                // False '--' '=='
     && lk != 675335                // Character '--' '=='
     && lk != 675336                // String '--' '=='
     && lk != 675337                // Real '--' '=='
     && lk != 677935                // '[' ']' '=='
     && lk != 691203                // Identifier '++' '>'
     && lk != 691204                // Null '++' '>'
     && lk != 691205                // True '++' '>'
     && lk != 691206                // False '++' '>'
     && lk != 691207                // Character '++' '>'
     && lk != 691208                // String '++' '>'
     && lk != 691209                // Real '++' '>'
     && lk != 691715                // Identifier '--' '>'
     && lk != 691716                // Null '--' '>'
     && lk != 691717                // True '--' '>'
     && lk != 691718                // False '--' '>'
     && lk != 691719                // Character '--' '>'
     && lk != 691720                // String '--' '>'
     && lk != 691721                // Real '--' '>'
     && lk != 694319                // '[' ']' '>'
     && lk != 707587                // Identifier '++' '>='
     && lk != 707588                // Null '++' '>='
     && lk != 707589                // True '++' '>='
     && lk != 707590                // False '++' '>='
     && lk != 707591                // Character '++' '>='
     && lk != 707592                // String '++' '>='
     && lk != 707593                // Real '++' '>='
     && lk != 708099                // Identifier '--' '>='
     && lk != 708100                // Null '--' '>='
     && lk != 708101                // True '--' '>='
     && lk != 708102                // False '--' '>='
     && lk != 708103                // Character '--' '>='
     && lk != 708104                // String '--' '>='
     && lk != 708105                // Real '--' '>='
     && lk != 710703                // '[' ']' '>='
     && lk != 723971                // Identifier '++' '>>'
     && lk != 723972                // Null '++' '>>'
     && lk != 723973                // True '++' '>>'
     && lk != 723974                // False '++' '>>'
     && lk != 723975                // Character '++' '>>'
     && lk != 723976                // String '++' '>>'
     && lk != 723977                // Real '++' '>>'
     && lk != 724483                // Identifier '--' '>>'
     && lk != 724484                // Null '--' '>>'
     && lk != 724485                // True '--' '>>'
     && lk != 724486                // False '--' '>>'
     && lk != 724487                // Character '--' '>>'
     && lk != 724488                // String '--' '>>'
     && lk != 724489                // Real '--' '>>'
     && lk != 727087                // '[' ']' '>>'
     && lk != 740355                // Identifier '++' '>>='
     && lk != 740356                // Null '++' '>>='
     && lk != 740357                // True '++' '>>='
     && lk != 740358                // False '++' '>>='
     && lk != 740359                // Character '++' '>>='
     && lk != 740360                // String '++' '>>='
     && lk != 740361                // Real '++' '>>='
     && lk != 740867                // Identifier '--' '>>='
     && lk != 740868                // Null '--' '>>='
     && lk != 740869                // True '--' '>>='
     && lk != 740870                // False '--' '>>='
     && lk != 740871                // Character '--' '>>='
     && lk != 740872                // String '--' '>>='
     && lk != 740873                // Real '--' '>>='
     && lk != 743471                // '[' ']' '>>='
     && lk != 756739                // Identifier '++' '?'
     && lk != 756740                // Null '++' '?'
     && lk != 756741                // True '++' '?'
     && lk != 756742                // False '++' '?'
     && lk != 756743                // Character '++' '?'
     && lk != 756744                // String '++' '?'
     && lk != 756745                // Real '++' '?'
     && lk != 757251                // Identifier '--' '?'
     && lk != 757252                // Null '--' '?'
     && lk != 757253                // True '--' '?'
     && lk != 757254                // False '--' '?'
     && lk != 757255                // Character '--' '?'
     && lk != 757256                // String '--' '?'
     && lk != 757257                // Real '--' '?'
     && lk != 759855                // '[' ']' '?'
     && lk != 776239                // '[' ']' '['
     && lk != 789507                // Identifier '++' ']'
     && lk != 789508                // Null '++' ']'
     && lk != 789509                // True '++' ']'
     && lk != 789510                // False '++' ']'
     && lk != 789511                // Character '++' ']'
     && lk != 789512                // String '++' ']'
     && lk != 789513                // Real '++' ']'
     && lk != 790019                // Identifier '--' ']'
     && lk != 790020                // Null '--' ']'
     && lk != 790021                // True '--' ']'
     && lk != 790022                // False '--' ']'
     && lk != 790023                // Character '--' ']'
     && lk != 790024                // String '--' ']'
     && lk != 790025                // Real '--' ']'
     && lk != 792451                // Identifier '[' ']'
     && lk != 792623                // '[' ']' ']'
     && lk != 805891                // Identifier '++' '^'
     && lk != 805892                // Null '++' '^'
     && lk != 805893                // True '++' '^'
     && lk != 805894                // False '++' '^'
     && lk != 805895                // Character '++' '^'
     && lk != 805896                // String '++' '^'
     && lk != 805897                // Real '++' '^'
     && lk != 806403                // Identifier '--' '^'
     && lk != 806404                // Null '--' '^'
     && lk != 806405                // True '--' '^'
     && lk != 806406                // False '--' '^'
     && lk != 806407                // Character '--' '^'
     && lk != 806408                // String '--' '^'
     && lk != 806409                // Real '--' '^'
     && lk != 809007                // '[' ']' '^'
     && lk != 822275                // Identifier '++' '^='
     && lk != 822276                // Null '++' '^='
     && lk != 822277                // True '++' '^='
     && lk != 822278                // False '++' '^='
     && lk != 822279                // Character '++' '^='
     && lk != 822280                // String '++' '^='
     && lk != 822281                // Real '++' '^='
     && lk != 822787                // Identifier '--' '^='
     && lk != 822788                // Null '--' '^='
     && lk != 822789                // True '--' '^='
     && lk != 822790                // False '--' '^='
     && lk != 822791                // Character '--' '^='
     && lk != 822792                // String '--' '^='
     && lk != 822793                // Real '--' '^='
     && lk != 825391                // '[' ']' '^='
     && lk != 838659                // Identifier '++' 'auto'
     && lk != 838660                // Null '++' 'auto'
     && lk != 838661                // True '++' 'auto'
     && lk != 838662                // False '++' 'auto'
     && lk != 838663                // Character '++' 'auto'
     && lk != 838664                // String '++' 'auto'
     && lk != 838665                // Real '++' 'auto'
     && lk != 839171                // Identifier '--' 'auto'
     && lk != 839172                // Null '--' 'auto'
     && lk != 839173                // True '--' 'auto'
     && lk != 839174                // False '--' 'auto'
     && lk != 839175                // Character '--' 'auto'
     && lk != 839176                // String '--' 'auto'
     && lk != 839177                // Real '--' 'auto'
     && lk != 841775                // '[' ']' 'auto'
     && lk != 855043                // Identifier '++' 'char'
     && lk != 855044                // Null '++' 'char'
     && lk != 855045                // True '++' 'char'
     && lk != 855046                // False '++' 'char'
     && lk != 855047                // Character '++' 'char'
     && lk != 855048                // String '++' 'char'
     && lk != 855049                // Real '++' 'char'
     && lk != 855555                // Identifier '--' 'char'
     && lk != 855556                // Null '--' 'char'
     && lk != 855557                // True '--' 'char'
     && lk != 855558                // False '--' 'char'
     && lk != 855559                // Character '--' 'char'
     && lk != 855560                // String '--' 'char'
     && lk != 855561                // Real '--' 'char'
     && lk != 858159                // '[' ']' 'char'
     && lk != 871427                // Identifier '++' 'const'
     && lk != 871428                // Null '++' 'const'
     && lk != 871429                // True '++' 'const'
     && lk != 871430                // False '++' 'const'
     && lk != 871431                // Character '++' 'const'
     && lk != 871432                // String '++' 'const'
     && lk != 871433                // Real '++' 'const'
     && lk != 871939                // Identifier '--' 'const'
     && lk != 871940                // Null '--' 'const'
     && lk != 871941                // True '--' 'const'
     && lk != 871942                // False '--' 'const'
     && lk != 871943                // Character '--' 'const'
     && lk != 871944                // String '--' 'const'
     && lk != 871945                // Real '--' 'const'
     && lk != 874543                // '[' ']' 'const'
     && lk != 887811                // Identifier '++' 'double'
     && lk != 887812                // Null '++' 'double'
     && lk != 887813                // True '++' 'double'
     && lk != 887814                // False '++' 'double'
     && lk != 887815                // Character '++' 'double'
     && lk != 887816                // String '++' 'double'
     && lk != 887817                // Real '++' 'double'
     && lk != 888323                // Identifier '--' 'double'
     && lk != 888324                // Null '--' 'double'
     && lk != 888325                // True '--' 'double'
     && lk != 888326                // False '--' 'double'
     && lk != 888327                // Character '--' 'double'
     && lk != 888328                // String '--' 'double'
     && lk != 888329                // Real '--' 'double'
     && lk != 890927                // '[' ']' 'double'
     && lk != 904195                // Identifier '++' 'extern'
     && lk != 904196                // Null '++' 'extern'
     && lk != 904197                // True '++' 'extern'
     && lk != 904198                // False '++' 'extern'
     && lk != 904199                // Character '++' 'extern'
     && lk != 904200                // String '++' 'extern'
     && lk != 904201                // Real '++' 'extern'
     && lk != 904707                // Identifier '--' 'extern'
     && lk != 904708                // Null '--' 'extern'
     && lk != 904709                // True '--' 'extern'
     && lk != 904710                // False '--' 'extern'
     && lk != 904711                // Character '--' 'extern'
     && lk != 904712                // String '--' 'extern'
     && lk != 904713                // Real '--' 'extern'
     && lk != 907311                // '[' ']' 'extern'
     && lk != 920579                // Identifier '++' 'float'
     && lk != 920580                // Null '++' 'float'
     && lk != 920581                // True '++' 'float'
     && lk != 920582                // False '++' 'float'
     && lk != 920583                // Character '++' 'float'
     && lk != 920584                // String '++' 'float'
     && lk != 920585                // Real '++' 'float'
     && lk != 921091                // Identifier '--' 'float'
     && lk != 921092                // Null '--' 'float'
     && lk != 921093                // True '--' 'float'
     && lk != 921094                // False '--' 'float'
     && lk != 921095                // Character '--' 'float'
     && lk != 921096                // String '--' 'float'
     && lk != 921097                // Real '--' 'float'
     && lk != 923695                // '[' ']' 'float'
     && lk != 936963                // Identifier '++' 'int'
     && lk != 936964                // Null '++' 'int'
     && lk != 936965                // True '++' 'int'
     && lk != 936966                // False '++' 'int'
     && lk != 936967                // Character '++' 'int'
     && lk != 936968                // String '++' 'int'
     && lk != 936969                // Real '++' 'int'
     && lk != 937475                // Identifier '--' 'int'
     && lk != 937476                // Null '--' 'int'
     && lk != 937477                // True '--' 'int'
     && lk != 937478                // False '--' 'int'
     && lk != 937479                // Character '--' 'int'
     && lk != 937480                // String '--' 'int'
     && lk != 937481                // Real '--' 'int'
     && lk != 940079                // '[' ']' 'int'
     && lk != 953347                // Identifier '++' 'long'
     && lk != 953348                // Null '++' 'long'
     && lk != 953349                // True '++' 'long'
     && lk != 953350                // False '++' 'long'
     && lk != 953351                // Character '++' 'long'
     && lk != 953352                // String '++' 'long'
     && lk != 953353                // Real '++' 'long'
     && lk != 953859                // Identifier '--' 'long'
     && lk != 953860                // Null '--' 'long'
     && lk != 953861                // True '--' 'long'
     && lk != 953862                // False '--' 'long'
     && lk != 953863                // Character '--' 'long'
     && lk != 953864                // String '--' 'long'
     && lk != 953865                // Real '--' 'long'
     && lk != 956463                // '[' ']' 'long'
     && lk != 969731                // Identifier '++' 'register'
     && lk != 969732                // Null '++' 'register'
     && lk != 969733                // True '++' 'register'
     && lk != 969734                // False '++' 'register'
     && lk != 969735                // Character '++' 'register'
     && lk != 969736                // String '++' 'register'
     && lk != 969737                // Real '++' 'register'
     && lk != 970243                // Identifier '--' 'register'
     && lk != 970244                // Null '--' 'register'
     && lk != 970245                // True '--' 'register'
     && lk != 970246                // False '--' 'register'
     && lk != 970247                // Character '--' 'register'
     && lk != 970248                // String '--' 'register'
     && lk != 970249                // Real '--' 'register'
     && lk != 972847                // '[' ']' 'register'
     && lk != 986115                // Identifier '++' 'short'
     && lk != 986116                // Null '++' 'short'
     && lk != 986117                // True '++' 'short'
     && lk != 986118                // False '++' 'short'
     && lk != 986119                // Character '++' 'short'
     && lk != 986120                // String '++' 'short'
     && lk != 986121                // Real '++' 'short'
     && lk != 986627                // Identifier '--' 'short'
     && lk != 986628                // Null '--' 'short'
     && lk != 986629                // True '--' 'short'
     && lk != 986630                // False '--' 'short'
     && lk != 986631                // Character '--' 'short'
     && lk != 986632                // String '--' 'short'
     && lk != 986633                // Real '--' 'short'
     && lk != 989231                // '[' ']' 'short'
     && lk != 1002499               // Identifier '++' 'signed'
     && lk != 1002500               // Null '++' 'signed'
     && lk != 1002501               // True '++' 'signed'
     && lk != 1002502               // False '++' 'signed'
     && lk != 1002503               // Character '++' 'signed'
     && lk != 1002504               // String '++' 'signed'
     && lk != 1002505               // Real '++' 'signed'
     && lk != 1003011               // Identifier '--' 'signed'
     && lk != 1003012               // Null '--' 'signed'
     && lk != 1003013               // True '--' 'signed'
     && lk != 1003014               // False '--' 'signed'
     && lk != 1003015               // Character '--' 'signed'
     && lk != 1003016               // String '--' 'signed'
     && lk != 1003017               // Real '--' 'signed'
     && lk != 1005615               // '[' ']' 'signed'
     && lk != 1018883               // Identifier '++' 'static'
     && lk != 1018884               // Null '++' 'static'
     && lk != 1018885               // True '++' 'static'
     && lk != 1018886               // False '++' 'static'
     && lk != 1018887               // Character '++' 'static'
     && lk != 1018888               // String '++' 'static'
     && lk != 1018889               // Real '++' 'static'
     && lk != 1019395               // Identifier '--' 'static'
     && lk != 1019396               // Null '--' 'static'
     && lk != 1019397               // True '--' 'static'
     && lk != 1019398               // False '--' 'static'
     && lk != 1019399               // Character '--' 'static'
     && lk != 1019400               // String '--' 'static'
     && lk != 1019401               // Real '--' 'static'
     && lk != 1021999               // '[' ']' 'static'
     && lk != 1035267               // Identifier '++' 'unsigned'
     && lk != 1035268               // Null '++' 'unsigned'
     && lk != 1035269               // True '++' 'unsigned'
     && lk != 1035270               // False '++' 'unsigned'
     && lk != 1035271               // Character '++' 'unsigned'
     && lk != 1035272               // String '++' 'unsigned'
     && lk != 1035273               // Real '++' 'unsigned'
     && lk != 1035779               // Identifier '--' 'unsigned'
     && lk != 1035780               // Null '--' 'unsigned'
     && lk != 1035781               // True '--' 'unsigned'
     && lk != 1035782               // False '--' 'unsigned'
     && lk != 1035783               // Character '--' 'unsigned'
     && lk != 1035784               // String '--' 'unsigned'
     && lk != 1035785               // Real '--' 'unsigned'
     && lk != 1038383               // '[' ']' 'unsigned'
     && lk != 1051651               // Identifier '++' 'void'
     && lk != 1051652               // Null '++' 'void'
     && lk != 1051653               // True '++' 'void'
     && lk != 1051654               // False '++' 'void'
     && lk != 1051655               // Character '++' 'void'
     && lk != 1051656               // String '++' 'void'
     && lk != 1051657               // Real '++' 'void'
     && lk != 1052163               // Identifier '--' 'void'
     && lk != 1052164               // Null '--' 'void'
     && lk != 1052165               // True '--' 'void'
     && lk != 1052166               // False '--' 'void'
     && lk != 1052167               // Character '--' 'void'
     && lk != 1052168               // String '--' 'void'
     && lk != 1052169               // Real '--' 'void'
     && lk != 1054767               // '[' ']' 'void'
     && lk != 1068035               // Identifier '++' 'volatile'
     && lk != 1068036               // Null '++' 'volatile'
     && lk != 1068037               // True '++' 'volatile'
     && lk != 1068038               // False '++' 'volatile'
     && lk != 1068039               // Character '++' 'volatile'
     && lk != 1068040               // String '++' 'volatile'
     && lk != 1068041               // Real '++' 'volatile'
     && lk != 1068547               // Identifier '--' 'volatile'
     && lk != 1068548               // Null '--' 'volatile'
     && lk != 1068549               // True '--' 'volatile'
     && lk != 1068550               // False '--' 'volatile'
     && lk != 1068551               // Character '--' 'volatile'
     && lk != 1068552               // String '--' 'volatile'
     && lk != 1068553               // Real '--' 'volatile'
     && lk != 1071151               // '[' ']' 'volatile'
     && lk != 1087535               // '[' ']' '{'
     && lk != 1100803               // Identifier '++' '|'
     && lk != 1100804               // Null '++' '|'
     && lk != 1100805               // True '++' '|'
     && lk != 1100806               // False '++' '|'
     && lk != 1100807               // Character '++' '|'
     && lk != 1100808               // String '++' '|'
     && lk != 1100809               // Real '++' '|'
     && lk != 1101315               // Identifier '--' '|'
     && lk != 1101316               // Null '--' '|'
     && lk != 1101317               // True '--' '|'
     && lk != 1101318               // False '--' '|'
     && lk != 1101319               // Character '--' '|'
     && lk != 1101320               // String '--' '|'
     && lk != 1101321               // Real '--' '|'
     && lk != 1103919               // '[' ']' '|'
     && lk != 1117187               // Identifier '++' '|='
     && lk != 1117188               // Null '++' '|='
     && lk != 1117189               // True '++' '|='
     && lk != 1117190               // False '++' '|='
     && lk != 1117191               // Character '++' '|='
     && lk != 1117192               // String '++' '|='
     && lk != 1117193               // Real '++' '|='
     && lk != 1117699               // Identifier '--' '|='
     && lk != 1117700               // Null '--' '|='
     && lk != 1117701               // True '--' '|='
     && lk != 1117702               // False '--' '|='
     && lk != 1117703               // Character '--' '|='
     && lk != 1117704               // String '--' '|='
     && lk != 1117705               // Real '--' '|='
     && lk != 1120303               // '[' ']' '|='
     && lk != 1133571               // Identifier '++' '||'
     && lk != 1133572               // Null '++' '||'
     && lk != 1133573               // True '++' '||'
     && lk != 1133574               // False '++' '||'
     && lk != 1133575               // Character '++' '||'
     && lk != 1133576               // String '++' '||'
     && lk != 1133577               // Real '++' '||'
     && lk != 1134083               // Identifier '--' '||'
     && lk != 1134084               // Null '--' '||'
     && lk != 1134085               // True '--' '||'
     && lk != 1134086               // False '--' '||'
     && lk != 1134087               // Character '--' '||'
     && lk != 1134088               // String '--' '||'
     && lk != 1134089               // Real '--' '||'
     && lk != 1136687               // '[' ']' '||'
     && lk != 1149955               // Identifier '++' '}'
     && lk != 1149956               // Null '++' '}'
     && lk != 1149957               // True '++' '}'
     && lk != 1149958               // False '++' '}'
     && lk != 1149959               // Character '++' '}'
     && lk != 1149960               // String '++' '}'
     && lk != 1149961               // Real '++' '}'
     && lk != 1150467               // Identifier '--' '}'
     && lk != 1150468               // Null '--' '}'
     && lk != 1150469               // True '--' '}'
     && lk != 1150470               // False '--' '}'
     && lk != 1150471               // Character '--' '}'
     && lk != 1150472               // String '--' '}'
     && lk != 1150473               // Real '--' '}'
     && lk != 1153071               // '[' ']' '}'
     && lk != 1166339               // Identifier '++' '~'
     && lk != 1166340               // Null '++' '~'
     && lk != 1166341               // True '++' '~'
     && lk != 1166342               // False '++' '~'
     && lk != 1166343               // Character '++' '~'
     && lk != 1166344               // String '++' '~'
     && lk != 1166345               // Real '++' '~'
     && lk != 1166851               // Identifier '--' '~'
     && lk != 1166852               // Null '--' '~'
     && lk != 1166853               // True '--' '~'
     && lk != 1166854               // False '--' '~'
     && lk != 1166855               // Character '--' '~'
     && lk != 1166856               // String '--' '~'
     && lk != 1166857               // Real '--' '~'
     && lk != 1169455)              // '[' ']' '~'
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
    case 71:                        // '~'
      consume(71);                  // '~'
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
    case 19459:                     // Identifier '++' END
    case 19460:                     // Null '++' END
    case 19461:                     // True '++' END
    case 19462:                     // False '++' END
    case 19463:                     // Character '++' END
    case 19464:                     // String '++' END
    case 19465:                     // Real '++' END
    case 166915:                    // Identifier '++' Comment
    case 166916:                    // Null '++' Comment
    case 166917:                    // True '++' Comment
    case 166918:                    // False '++' Comment
    case 166919:                    // Character '++' Comment
    case 166920:                    // String '++' Comment
    case 166921:                    // Real '++' Comment
    case 199683:                    // Identifier '++' '!'
    case 199684:                    // Null '++' '!'
    case 199685:                    // True '++' '!'
    case 199686:                    // False '++' '!'
    case 199687:                    // Character '++' '!'
    case 199688:                    // String '++' '!'
    case 199689:                    // Real '++' '!'
    case 216067:                    // Identifier '++' '!='
    case 216068:                    // Null '++' '!='
    case 216069:                    // True '++' '!='
    case 216070:                    // False '++' '!='
    case 216071:                    // Character '++' '!='
    case 216072:                    // String '++' '!='
    case 216073:                    // Real '++' '!='
    case 232451:                    // Identifier '++' '%'
    case 232452:                    // Null '++' '%'
    case 232453:                    // True '++' '%'
    case 232454:                    // False '++' '%'
    case 232455:                    // Character '++' '%'
    case 232456:                    // String '++' '%'
    case 232457:                    // Real '++' '%'
    case 248835:                    // Identifier '++' '%='
    case 248836:                    // Null '++' '%='
    case 248837:                    // True '++' '%='
    case 248838:                    // False '++' '%='
    case 248839:                    // Character '++' '%='
    case 248840:                    // String '++' '%='
    case 248841:                    // Real '++' '%='
    case 265219:                    // Identifier '++' '&'
    case 265220:                    // Null '++' '&'
    case 265221:                    // True '++' '&'
    case 265222:                    // False '++' '&'
    case 265223:                    // Character '++' '&'
    case 265224:                    // String '++' '&'
    case 265225:                    // Real '++' '&'
    case 281603:                    // Identifier '++' '&&'
    case 281604:                    // Null '++' '&&'
    case 281605:                    // True '++' '&&'
    case 281606:                    // False '++' '&&'
    case 281607:                    // Character '++' '&&'
    case 281608:                    // String '++' '&&'
    case 281609:                    // Real '++' '&&'
    case 297987:                    // Identifier '++' '&='
    case 297988:                    // Null '++' '&='
    case 297989:                    // True '++' '&='
    case 297990:                    // False '++' '&='
    case 297991:                    // Character '++' '&='
    case 297992:                    // String '++' '&='
    case 297993:                    // Real '++' '&='
    case 330755:                    // Identifier '++' ')'
    case 330756:                    // Null '++' ')'
    case 330757:                    // True '++' ')'
    case 330758:                    // False '++' ')'
    case 330759:                    // Character '++' ')'
    case 330760:                    // String '++' ')'
    case 330761:                    // Real '++' ')'
    case 347139:                    // Identifier '++' '*'
    case 347140:                    // Null '++' '*'
    case 347141:                    // True '++' '*'
    case 347142:                    // False '++' '*'
    case 347143:                    // Character '++' '*'
    case 347144:                    // String '++' '*'
    case 347145:                    // Real '++' '*'
    case 363523:                    // Identifier '++' '*='
    case 363524:                    // Null '++' '*='
    case 363525:                    // True '++' '*='
    case 363526:                    // False '++' '*='
    case 363527:                    // Character '++' '*='
    case 363528:                    // String '++' '*='
    case 363529:                    // Real '++' '*='
    case 379907:                    // Identifier '++' '+'
    case 379908:                    // Null '++' '+'
    case 379909:                    // True '++' '+'
    case 379910:                    // False '++' '+'
    case 379911:                    // Character '++' '+'
    case 379912:                    // String '++' '+'
    case 379913:                    // Real '++' '+'
    case 396291:                    // Identifier '++' '++'
    case 396292:                    // Null '++' '++'
    case 396293:                    // True '++' '++'
    case 396294:                    // False '++' '++'
    case 396295:                    // Character '++' '++'
    case 396296:                    // String '++' '++'
    case 396297:                    // Real '++' '++'
    case 412675:                    // Identifier '++' '+='
    case 412676:                    // Null '++' '+='
    case 412677:                    // True '++' '+='
    case 412678:                    // False '++' '+='
    case 412679:                    // Character '++' '+='
    case 412680:                    // String '++' '+='
    case 412681:                    // Real '++' '+='
    case 429059:                    // Identifier '++' ','
    case 429060:                    // Null '++' ','
    case 429061:                    // True '++' ','
    case 429062:                    // False '++' ','
    case 429063:                    // Character '++' ','
    case 429064:                    // String '++' ','
    case 429065:                    // Real '++' ','
    case 445443:                    // Identifier '++' '-'
    case 445444:                    // Null '++' '-'
    case 445445:                    // True '++' '-'
    case 445446:                    // False '++' '-'
    case 445447:                    // Character '++' '-'
    case 445448:                    // String '++' '-'
    case 445449:                    // Real '++' '-'
    case 461827:                    // Identifier '++' '--'
    case 461828:                    // Null '++' '--'
    case 461829:                    // True '++' '--'
    case 461830:                    // False '++' '--'
    case 461831:                    // Character '++' '--'
    case 461832:                    // String '++' '--'
    case 461833:                    // Real '++' '--'
    case 478211:                    // Identifier '++' '-='
    case 478212:                    // Null '++' '-='
    case 478213:                    // True '++' '-='
    case 478214:                    // False '++' '-='
    case 478215:                    // Character '++' '-='
    case 478216:                    // String '++' '-='
    case 478217:                    // Real '++' '-='
    case 527363:                    // Identifier '++' '/'
    case 527364:                    // Null '++' '/'
    case 527365:                    // True '++' '/'
    case 527366:                    // False '++' '/'
    case 527367:                    // Character '++' '/'
    case 527368:                    // String '++' '/'
    case 527369:                    // Real '++' '/'
    case 543747:                    // Identifier '++' '/='
    case 543748:                    // Null '++' '/='
    case 543749:                    // True '++' '/='
    case 543750:                    // False '++' '/='
    case 543751:                    // Character '++' '/='
    case 543752:                    // String '++' '/='
    case 543753:                    // Real '++' '/='
    case 560131:                    // Identifier '++' ':'
    case 560132:                    // Null '++' ':'
    case 560133:                    // True '++' ':'
    case 560134:                    // False '++' ':'
    case 560135:                    // Character '++' ':'
    case 560136:                    // String '++' ':'
    case 560137:                    // Real '++' ':'
    case 576515:                    // Identifier '++' ';'
    case 576516:                    // Null '++' ';'
    case 576517:                    // True '++' ';'
    case 576518:                    // False '++' ';'
    case 576519:                    // Character '++' ';'
    case 576520:                    // String '++' ';'
    case 576521:                    // Real '++' ';'
    case 592899:                    // Identifier '++' '<'
    case 592900:                    // Null '++' '<'
    case 592901:                    // True '++' '<'
    case 592902:                    // False '++' '<'
    case 592903:                    // Character '++' '<'
    case 592904:                    // String '++' '<'
    case 592905:                    // Real '++' '<'
    case 609283:                    // Identifier '++' '<<'
    case 609284:                    // Null '++' '<<'
    case 609285:                    // True '++' '<<'
    case 609286:                    // False '++' '<<'
    case 609287:                    // Character '++' '<<'
    case 609288:                    // String '++' '<<'
    case 609289:                    // Real '++' '<<'
    case 625667:                    // Identifier '++' '<<='
    case 625668:                    // Null '++' '<<='
    case 625669:                    // True '++' '<<='
    case 625670:                    // False '++' '<<='
    case 625671:                    // Character '++' '<<='
    case 625672:                    // String '++' '<<='
    case 625673:                    // Real '++' '<<='
    case 642051:                    // Identifier '++' '<='
    case 642052:                    // Null '++' '<='
    case 642053:                    // True '++' '<='
    case 642054:                    // False '++' '<='
    case 642055:                    // Character '++' '<='
    case 642056:                    // String '++' '<='
    case 642057:                    // Real '++' '<='
    case 658435:                    // Identifier '++' '='
    case 658436:                    // Null '++' '='
    case 658437:                    // True '++' '='
    case 658438:                    // False '++' '='
    case 658439:                    // Character '++' '='
    case 658440:                    // String '++' '='
    case 658441:                    // Real '++' '='
    case 674819:                    // Identifier '++' '=='
    case 674820:                    // Null '++' '=='
    case 674821:                    // True '++' '=='
    case 674822:                    // False '++' '=='
    case 674823:                    // Character '++' '=='
    case 674824:                    // String '++' '=='
    case 674825:                    // Real '++' '=='
    case 691203:                    // Identifier '++' '>'
    case 691204:                    // Null '++' '>'
    case 691205:                    // True '++' '>'
    case 691206:                    // False '++' '>'
    case 691207:                    // Character '++' '>'
    case 691208:                    // String '++' '>'
    case 691209:                    // Real '++' '>'
    case 707587:                    // Identifier '++' '>='
    case 707588:                    // Null '++' '>='
    case 707589:                    // True '++' '>='
    case 707590:                    // False '++' '>='
    case 707591:                    // Character '++' '>='
    case 707592:                    // String '++' '>='
    case 707593:                    // Real '++' '>='
    case 723971:                    // Identifier '++' '>>'
    case 723972:                    // Null '++' '>>'
    case 723973:                    // True '++' '>>'
    case 723974:                    // False '++' '>>'
    case 723975:                    // Character '++' '>>'
    case 723976:                    // String '++' '>>'
    case 723977:                    // Real '++' '>>'
    case 740355:                    // Identifier '++' '>>='
    case 740356:                    // Null '++' '>>='
    case 740357:                    // True '++' '>>='
    case 740358:                    // False '++' '>>='
    case 740359:                    // Character '++' '>>='
    case 740360:                    // String '++' '>>='
    case 740361:                    // Real '++' '>>='
    case 756739:                    // Identifier '++' '?'
    case 756740:                    // Null '++' '?'
    case 756741:                    // True '++' '?'
    case 756742:                    // False '++' '?'
    case 756743:                    // Character '++' '?'
    case 756744:                    // String '++' '?'
    case 756745:                    // Real '++' '?'
    case 789507:                    // Identifier '++' ']'
    case 789508:                    // Null '++' ']'
    case 789509:                    // True '++' ']'
    case 789510:                    // False '++' ']'
    case 789511:                    // Character '++' ']'
    case 789512:                    // String '++' ']'
    case 789513:                    // Real '++' ']'
    case 805891:                    // Identifier '++' '^'
    case 805892:                    // Null '++' '^'
    case 805893:                    // True '++' '^'
    case 805894:                    // False '++' '^'
    case 805895:                    // Character '++' '^'
    case 805896:                    // String '++' '^'
    case 805897:                    // Real '++' '^'
    case 822275:                    // Identifier '++' '^='
    case 822276:                    // Null '++' '^='
    case 822277:                    // True '++' '^='
    case 822278:                    // False '++' '^='
    case 822279:                    // Character '++' '^='
    case 822280:                    // String '++' '^='
    case 822281:                    // Real '++' '^='
    case 838659:                    // Identifier '++' 'auto'
    case 838660:                    // Null '++' 'auto'
    case 838661:                    // True '++' 'auto'
    case 838662:                    // False '++' 'auto'
    case 838663:                    // Character '++' 'auto'
    case 838664:                    // String '++' 'auto'
    case 838665:                    // Real '++' 'auto'
    case 855043:                    // Identifier '++' 'char'
    case 855044:                    // Null '++' 'char'
    case 855045:                    // True '++' 'char'
    case 855046:                    // False '++' 'char'
    case 855047:                    // Character '++' 'char'
    case 855048:                    // String '++' 'char'
    case 855049:                    // Real '++' 'char'
    case 871427:                    // Identifier '++' 'const'
    case 871428:                    // Null '++' 'const'
    case 871429:                    // True '++' 'const'
    case 871430:                    // False '++' 'const'
    case 871431:                    // Character '++' 'const'
    case 871432:                    // String '++' 'const'
    case 871433:                    // Real '++' 'const'
    case 887811:                    // Identifier '++' 'double'
    case 887812:                    // Null '++' 'double'
    case 887813:                    // True '++' 'double'
    case 887814:                    // False '++' 'double'
    case 887815:                    // Character '++' 'double'
    case 887816:                    // String '++' 'double'
    case 887817:                    // Real '++' 'double'
    case 904195:                    // Identifier '++' 'extern'
    case 904196:                    // Null '++' 'extern'
    case 904197:                    // True '++' 'extern'
    case 904198:                    // False '++' 'extern'
    case 904199:                    // Character '++' 'extern'
    case 904200:                    // String '++' 'extern'
    case 904201:                    // Real '++' 'extern'
    case 920579:                    // Identifier '++' 'float'
    case 920580:                    // Null '++' 'float'
    case 920581:                    // True '++' 'float'
    case 920582:                    // False '++' 'float'
    case 920583:                    // Character '++' 'float'
    case 920584:                    // String '++' 'float'
    case 920585:                    // Real '++' 'float'
    case 936963:                    // Identifier '++' 'int'
    case 936964:                    // Null '++' 'int'
    case 936965:                    // True '++' 'int'
    case 936966:                    // False '++' 'int'
    case 936967:                    // Character '++' 'int'
    case 936968:                    // String '++' 'int'
    case 936969:                    // Real '++' 'int'
    case 953347:                    // Identifier '++' 'long'
    case 953348:                    // Null '++' 'long'
    case 953349:                    // True '++' 'long'
    case 953350:                    // False '++' 'long'
    case 953351:                    // Character '++' 'long'
    case 953352:                    // String '++' 'long'
    case 953353:                    // Real '++' 'long'
    case 969731:                    // Identifier '++' 'register'
    case 969732:                    // Null '++' 'register'
    case 969733:                    // True '++' 'register'
    case 969734:                    // False '++' 'register'
    case 969735:                    // Character '++' 'register'
    case 969736:                    // String '++' 'register'
    case 969737:                    // Real '++' 'register'
    case 986115:                    // Identifier '++' 'short'
    case 986116:                    // Null '++' 'short'
    case 986117:                    // True '++' 'short'
    case 986118:                    // False '++' 'short'
    case 986119:                    // Character '++' 'short'
    case 986120:                    // String '++' 'short'
    case 986121:                    // Real '++' 'short'
    case 1002499:                   // Identifier '++' 'signed'
    case 1002500:                   // Null '++' 'signed'
    case 1002501:                   // True '++' 'signed'
    case 1002502:                   // False '++' 'signed'
    case 1002503:                   // Character '++' 'signed'
    case 1002504:                   // String '++' 'signed'
    case 1002505:                   // Real '++' 'signed'
    case 1018883:                   // Identifier '++' 'static'
    case 1018884:                   // Null '++' 'static'
    case 1018885:                   // True '++' 'static'
    case 1018886:                   // False '++' 'static'
    case 1018887:                   // Character '++' 'static'
    case 1018888:                   // String '++' 'static'
    case 1018889:                   // Real '++' 'static'
    case 1035267:                   // Identifier '++' 'unsigned'
    case 1035268:                   // Null '++' 'unsigned'
    case 1035269:                   // True '++' 'unsigned'
    case 1035270:                   // False '++' 'unsigned'
    case 1035271:                   // Character '++' 'unsigned'
    case 1035272:                   // String '++' 'unsigned'
    case 1035273:                   // Real '++' 'unsigned'
    case 1051651:                   // Identifier '++' 'void'
    case 1051652:                   // Null '++' 'void'
    case 1051653:                   // True '++' 'void'
    case 1051654:                   // False '++' 'void'
    case 1051655:                   // Character '++' 'void'
    case 1051656:                   // String '++' 'void'
    case 1051657:                   // Real '++' 'void'
    case 1068035:                   // Identifier '++' 'volatile'
    case 1068036:                   // Null '++' 'volatile'
    case 1068037:                   // True '++' 'volatile'
    case 1068038:                   // False '++' 'volatile'
    case 1068039:                   // Character '++' 'volatile'
    case 1068040:                   // String '++' 'volatile'
    case 1068041:                   // Real '++' 'volatile'
    case 1100803:                   // Identifier '++' '|'
    case 1100804:                   // Null '++' '|'
    case 1100805:                   // True '++' '|'
    case 1100806:                   // False '++' '|'
    case 1100807:                   // Character '++' '|'
    case 1100808:                   // String '++' '|'
    case 1100809:                   // Real '++' '|'
    case 1117187:                   // Identifier '++' '|='
    case 1117188:                   // Null '++' '|='
    case 1117189:                   // True '++' '|='
    case 1117190:                   // False '++' '|='
    case 1117191:                   // Character '++' '|='
    case 1117192:                   // String '++' '|='
    case 1117193:                   // Real '++' '|='
    case 1133571:                   // Identifier '++' '||'
    case 1133572:                   // Null '++' '||'
    case 1133573:                   // True '++' '||'
    case 1133574:                   // False '++' '||'
    case 1133575:                   // Character '++' '||'
    case 1133576:                   // String '++' '||'
    case 1133577:                   // Real '++' '||'
    case 1149955:                   // Identifier '++' '}'
    case 1149956:                   // Null '++' '}'
    case 1149957:                   // True '++' '}'
    case 1149958:                   // False '++' '}'
    case 1149959:                   // Character '++' '}'
    case 1149960:                   // String '++' '}'
    case 1149961:                   // Real '++' '}'
    case 1166339:                   // Identifier '++' '~'
    case 1166340:                   // Null '++' '~'
    case 1166341:                   // True '++' '~'
    case 1166342:                   // False '++' '~'
    case 1166343:                   // Character '++' '~'
    case 1166344:                   // String '++' '~'
    case 1166345:                   // Real '++' '~'
      parse_Primary();
      lookahead1W(2);               // WhiteSpace^token | '++'
      consume(24);                  // '++'
      break;
    case -6:
    case 19971:                     // Identifier '--' END
    case 19972:                     // Null '--' END
    case 19973:                     // True '--' END
    case 19974:                     // False '--' END
    case 19975:                     // Character '--' END
    case 19976:                     // String '--' END
    case 19977:                     // Real '--' END
    case 167427:                    // Identifier '--' Comment
    case 167428:                    // Null '--' Comment
    case 167429:                    // True '--' Comment
    case 167430:                    // False '--' Comment
    case 167431:                    // Character '--' Comment
    case 167432:                    // String '--' Comment
    case 167433:                    // Real '--' Comment
    case 200195:                    // Identifier '--' '!'
    case 200196:                    // Null '--' '!'
    case 200197:                    // True '--' '!'
    case 200198:                    // False '--' '!'
    case 200199:                    // Character '--' '!'
    case 200200:                    // String '--' '!'
    case 200201:                    // Real '--' '!'
    case 216579:                    // Identifier '--' '!='
    case 216580:                    // Null '--' '!='
    case 216581:                    // True '--' '!='
    case 216582:                    // False '--' '!='
    case 216583:                    // Character '--' '!='
    case 216584:                    // String '--' '!='
    case 216585:                    // Real '--' '!='
    case 232963:                    // Identifier '--' '%'
    case 232964:                    // Null '--' '%'
    case 232965:                    // True '--' '%'
    case 232966:                    // False '--' '%'
    case 232967:                    // Character '--' '%'
    case 232968:                    // String '--' '%'
    case 232969:                    // Real '--' '%'
    case 249347:                    // Identifier '--' '%='
    case 249348:                    // Null '--' '%='
    case 249349:                    // True '--' '%='
    case 249350:                    // False '--' '%='
    case 249351:                    // Character '--' '%='
    case 249352:                    // String '--' '%='
    case 249353:                    // Real '--' '%='
    case 265731:                    // Identifier '--' '&'
    case 265732:                    // Null '--' '&'
    case 265733:                    // True '--' '&'
    case 265734:                    // False '--' '&'
    case 265735:                    // Character '--' '&'
    case 265736:                    // String '--' '&'
    case 265737:                    // Real '--' '&'
    case 282115:                    // Identifier '--' '&&'
    case 282116:                    // Null '--' '&&'
    case 282117:                    // True '--' '&&'
    case 282118:                    // False '--' '&&'
    case 282119:                    // Character '--' '&&'
    case 282120:                    // String '--' '&&'
    case 282121:                    // Real '--' '&&'
    case 298499:                    // Identifier '--' '&='
    case 298500:                    // Null '--' '&='
    case 298501:                    // True '--' '&='
    case 298502:                    // False '--' '&='
    case 298503:                    // Character '--' '&='
    case 298504:                    // String '--' '&='
    case 298505:                    // Real '--' '&='
    case 331267:                    // Identifier '--' ')'
    case 331268:                    // Null '--' ')'
    case 331269:                    // True '--' ')'
    case 331270:                    // False '--' ')'
    case 331271:                    // Character '--' ')'
    case 331272:                    // String '--' ')'
    case 331273:                    // Real '--' ')'
    case 347651:                    // Identifier '--' '*'
    case 347652:                    // Null '--' '*'
    case 347653:                    // True '--' '*'
    case 347654:                    // False '--' '*'
    case 347655:                    // Character '--' '*'
    case 347656:                    // String '--' '*'
    case 347657:                    // Real '--' '*'
    case 364035:                    // Identifier '--' '*='
    case 364036:                    // Null '--' '*='
    case 364037:                    // True '--' '*='
    case 364038:                    // False '--' '*='
    case 364039:                    // Character '--' '*='
    case 364040:                    // String '--' '*='
    case 364041:                    // Real '--' '*='
    case 380419:                    // Identifier '--' '+'
    case 380420:                    // Null '--' '+'
    case 380421:                    // True '--' '+'
    case 380422:                    // False '--' '+'
    case 380423:                    // Character '--' '+'
    case 380424:                    // String '--' '+'
    case 380425:                    // Real '--' '+'
    case 396803:                    // Identifier '--' '++'
    case 396804:                    // Null '--' '++'
    case 396805:                    // True '--' '++'
    case 396806:                    // False '--' '++'
    case 396807:                    // Character '--' '++'
    case 396808:                    // String '--' '++'
    case 396809:                    // Real '--' '++'
    case 413187:                    // Identifier '--' '+='
    case 413188:                    // Null '--' '+='
    case 413189:                    // True '--' '+='
    case 413190:                    // False '--' '+='
    case 413191:                    // Character '--' '+='
    case 413192:                    // String '--' '+='
    case 413193:                    // Real '--' '+='
    case 429571:                    // Identifier '--' ','
    case 429572:                    // Null '--' ','
    case 429573:                    // True '--' ','
    case 429574:                    // False '--' ','
    case 429575:                    // Character '--' ','
    case 429576:                    // String '--' ','
    case 429577:                    // Real '--' ','
    case 445955:                    // Identifier '--' '-'
    case 445956:                    // Null '--' '-'
    case 445957:                    // True '--' '-'
    case 445958:                    // False '--' '-'
    case 445959:                    // Character '--' '-'
    case 445960:                    // String '--' '-'
    case 445961:                    // Real '--' '-'
    case 462339:                    // Identifier '--' '--'
    case 462340:                    // Null '--' '--'
    case 462341:                    // True '--' '--'
    case 462342:                    // False '--' '--'
    case 462343:                    // Character '--' '--'
    case 462344:                    // String '--' '--'
    case 462345:                    // Real '--' '--'
    case 478723:                    // Identifier '--' '-='
    case 478724:                    // Null '--' '-='
    case 478725:                    // True '--' '-='
    case 478726:                    // False '--' '-='
    case 478727:                    // Character '--' '-='
    case 478728:                    // String '--' '-='
    case 478729:                    // Real '--' '-='
    case 527875:                    // Identifier '--' '/'
    case 527876:                    // Null '--' '/'
    case 527877:                    // True '--' '/'
    case 527878:                    // False '--' '/'
    case 527879:                    // Character '--' '/'
    case 527880:                    // String '--' '/'
    case 527881:                    // Real '--' '/'
    case 544259:                    // Identifier '--' '/='
    case 544260:                    // Null '--' '/='
    case 544261:                    // True '--' '/='
    case 544262:                    // False '--' '/='
    case 544263:                    // Character '--' '/='
    case 544264:                    // String '--' '/='
    case 544265:                    // Real '--' '/='
    case 560643:                    // Identifier '--' ':'
    case 560644:                    // Null '--' ':'
    case 560645:                    // True '--' ':'
    case 560646:                    // False '--' ':'
    case 560647:                    // Character '--' ':'
    case 560648:                    // String '--' ':'
    case 560649:                    // Real '--' ':'
    case 577027:                    // Identifier '--' ';'
    case 577028:                    // Null '--' ';'
    case 577029:                    // True '--' ';'
    case 577030:                    // False '--' ';'
    case 577031:                    // Character '--' ';'
    case 577032:                    // String '--' ';'
    case 577033:                    // Real '--' ';'
    case 593411:                    // Identifier '--' '<'
    case 593412:                    // Null '--' '<'
    case 593413:                    // True '--' '<'
    case 593414:                    // False '--' '<'
    case 593415:                    // Character '--' '<'
    case 593416:                    // String '--' '<'
    case 593417:                    // Real '--' '<'
    case 609795:                    // Identifier '--' '<<'
    case 609796:                    // Null '--' '<<'
    case 609797:                    // True '--' '<<'
    case 609798:                    // False '--' '<<'
    case 609799:                    // Character '--' '<<'
    case 609800:                    // String '--' '<<'
    case 609801:                    // Real '--' '<<'
    case 626179:                    // Identifier '--' '<<='
    case 626180:                    // Null '--' '<<='
    case 626181:                    // True '--' '<<='
    case 626182:                    // False '--' '<<='
    case 626183:                    // Character '--' '<<='
    case 626184:                    // String '--' '<<='
    case 626185:                    // Real '--' '<<='
    case 642563:                    // Identifier '--' '<='
    case 642564:                    // Null '--' '<='
    case 642565:                    // True '--' '<='
    case 642566:                    // False '--' '<='
    case 642567:                    // Character '--' '<='
    case 642568:                    // String '--' '<='
    case 642569:                    // Real '--' '<='
    case 658947:                    // Identifier '--' '='
    case 658948:                    // Null '--' '='
    case 658949:                    // True '--' '='
    case 658950:                    // False '--' '='
    case 658951:                    // Character '--' '='
    case 658952:                    // String '--' '='
    case 658953:                    // Real '--' '='
    case 675331:                    // Identifier '--' '=='
    case 675332:                    // Null '--' '=='
    case 675333:                    // True '--' '=='
    case 675334:                    // False '--' '=='
    case 675335:                    // Character '--' '=='
    case 675336:                    // String '--' '=='
    case 675337:                    // Real '--' '=='
    case 691715:                    // Identifier '--' '>'
    case 691716:                    // Null '--' '>'
    case 691717:                    // True '--' '>'
    case 691718:                    // False '--' '>'
    case 691719:                    // Character '--' '>'
    case 691720:                    // String '--' '>'
    case 691721:                    // Real '--' '>'
    case 708099:                    // Identifier '--' '>='
    case 708100:                    // Null '--' '>='
    case 708101:                    // True '--' '>='
    case 708102:                    // False '--' '>='
    case 708103:                    // Character '--' '>='
    case 708104:                    // String '--' '>='
    case 708105:                    // Real '--' '>='
    case 724483:                    // Identifier '--' '>>'
    case 724484:                    // Null '--' '>>'
    case 724485:                    // True '--' '>>'
    case 724486:                    // False '--' '>>'
    case 724487:                    // Character '--' '>>'
    case 724488:                    // String '--' '>>'
    case 724489:                    // Real '--' '>>'
    case 740867:                    // Identifier '--' '>>='
    case 740868:                    // Null '--' '>>='
    case 740869:                    // True '--' '>>='
    case 740870:                    // False '--' '>>='
    case 740871:                    // Character '--' '>>='
    case 740872:                    // String '--' '>>='
    case 740873:                    // Real '--' '>>='
    case 757251:                    // Identifier '--' '?'
    case 757252:                    // Null '--' '?'
    case 757253:                    // True '--' '?'
    case 757254:                    // False '--' '?'
    case 757255:                    // Character '--' '?'
    case 757256:                    // String '--' '?'
    case 757257:                    // Real '--' '?'
    case 790019:                    // Identifier '--' ']'
    case 790020:                    // Null '--' ']'
    case 790021:                    // True '--' ']'
    case 790022:                    // False '--' ']'
    case 790023:                    // Character '--' ']'
    case 790024:                    // String '--' ']'
    case 790025:                    // Real '--' ']'
    case 806403:                    // Identifier '--' '^'
    case 806404:                    // Null '--' '^'
    case 806405:                    // True '--' '^'
    case 806406:                    // False '--' '^'
    case 806407:                    // Character '--' '^'
    case 806408:                    // String '--' '^'
    case 806409:                    // Real '--' '^'
    case 822787:                    // Identifier '--' '^='
    case 822788:                    // Null '--' '^='
    case 822789:                    // True '--' '^='
    case 822790:                    // False '--' '^='
    case 822791:                    // Character '--' '^='
    case 822792:                    // String '--' '^='
    case 822793:                    // Real '--' '^='
    case 839171:                    // Identifier '--' 'auto'
    case 839172:                    // Null '--' 'auto'
    case 839173:                    // True '--' 'auto'
    case 839174:                    // False '--' 'auto'
    case 839175:                    // Character '--' 'auto'
    case 839176:                    // String '--' 'auto'
    case 839177:                    // Real '--' 'auto'
    case 855555:                    // Identifier '--' 'char'
    case 855556:                    // Null '--' 'char'
    case 855557:                    // True '--' 'char'
    case 855558:                    // False '--' 'char'
    case 855559:                    // Character '--' 'char'
    case 855560:                    // String '--' 'char'
    case 855561:                    // Real '--' 'char'
    case 871939:                    // Identifier '--' 'const'
    case 871940:                    // Null '--' 'const'
    case 871941:                    // True '--' 'const'
    case 871942:                    // False '--' 'const'
    case 871943:                    // Character '--' 'const'
    case 871944:                    // String '--' 'const'
    case 871945:                    // Real '--' 'const'
    case 888323:                    // Identifier '--' 'double'
    case 888324:                    // Null '--' 'double'
    case 888325:                    // True '--' 'double'
    case 888326:                    // False '--' 'double'
    case 888327:                    // Character '--' 'double'
    case 888328:                    // String '--' 'double'
    case 888329:                    // Real '--' 'double'
    case 904707:                    // Identifier '--' 'extern'
    case 904708:                    // Null '--' 'extern'
    case 904709:                    // True '--' 'extern'
    case 904710:                    // False '--' 'extern'
    case 904711:                    // Character '--' 'extern'
    case 904712:                    // String '--' 'extern'
    case 904713:                    // Real '--' 'extern'
    case 921091:                    // Identifier '--' 'float'
    case 921092:                    // Null '--' 'float'
    case 921093:                    // True '--' 'float'
    case 921094:                    // False '--' 'float'
    case 921095:                    // Character '--' 'float'
    case 921096:                    // String '--' 'float'
    case 921097:                    // Real '--' 'float'
    case 937475:                    // Identifier '--' 'int'
    case 937476:                    // Null '--' 'int'
    case 937477:                    // True '--' 'int'
    case 937478:                    // False '--' 'int'
    case 937479:                    // Character '--' 'int'
    case 937480:                    // String '--' 'int'
    case 937481:                    // Real '--' 'int'
    case 953859:                    // Identifier '--' 'long'
    case 953860:                    // Null '--' 'long'
    case 953861:                    // True '--' 'long'
    case 953862:                    // False '--' 'long'
    case 953863:                    // Character '--' 'long'
    case 953864:                    // String '--' 'long'
    case 953865:                    // Real '--' 'long'
    case 970243:                    // Identifier '--' 'register'
    case 970244:                    // Null '--' 'register'
    case 970245:                    // True '--' 'register'
    case 970246:                    // False '--' 'register'
    case 970247:                    // Character '--' 'register'
    case 970248:                    // String '--' 'register'
    case 970249:                    // Real '--' 'register'
    case 986627:                    // Identifier '--' 'short'
    case 986628:                    // Null '--' 'short'
    case 986629:                    // True '--' 'short'
    case 986630:                    // False '--' 'short'
    case 986631:                    // Character '--' 'short'
    case 986632:                    // String '--' 'short'
    case 986633:                    // Real '--' 'short'
    case 1003011:                   // Identifier '--' 'signed'
    case 1003012:                   // Null '--' 'signed'
    case 1003013:                   // True '--' 'signed'
    case 1003014:                   // False '--' 'signed'
    case 1003015:                   // Character '--' 'signed'
    case 1003016:                   // String '--' 'signed'
    case 1003017:                   // Real '--' 'signed'
    case 1019395:                   // Identifier '--' 'static'
    case 1019396:                   // Null '--' 'static'
    case 1019397:                   // True '--' 'static'
    case 1019398:                   // False '--' 'static'
    case 1019399:                   // Character '--' 'static'
    case 1019400:                   // String '--' 'static'
    case 1019401:                   // Real '--' 'static'
    case 1035779:                   // Identifier '--' 'unsigned'
    case 1035780:                   // Null '--' 'unsigned'
    case 1035781:                   // True '--' 'unsigned'
    case 1035782:                   // False '--' 'unsigned'
    case 1035783:                   // Character '--' 'unsigned'
    case 1035784:                   // String '--' 'unsigned'
    case 1035785:                   // Real '--' 'unsigned'
    case 1052163:                   // Identifier '--' 'void'
    case 1052164:                   // Null '--' 'void'
    case 1052165:                   // True '--' 'void'
    case 1052166:                   // False '--' 'void'
    case 1052167:                   // Character '--' 'void'
    case 1052168:                   // String '--' 'void'
    case 1052169:                   // Real '--' 'void'
    case 1068547:                   // Identifier '--' 'volatile'
    case 1068548:                   // Null '--' 'volatile'
    case 1068549:                   // True '--' 'volatile'
    case 1068550:                   // False '--' 'volatile'
    case 1068551:                   // Character '--' 'volatile'
    case 1068552:                   // String '--' 'volatile'
    case 1068553:                   // Real '--' 'volatile'
    case 1101315:                   // Identifier '--' '|'
    case 1101316:                   // Null '--' '|'
    case 1101317:                   // True '--' '|'
    case 1101318:                   // False '--' '|'
    case 1101319:                   // Character '--' '|'
    case 1101320:                   // String '--' '|'
    case 1101321:                   // Real '--' '|'
    case 1117699:                   // Identifier '--' '|='
    case 1117700:                   // Null '--' '|='
    case 1117701:                   // True '--' '|='
    case 1117702:                   // False '--' '|='
    case 1117703:                   // Character '--' '|='
    case 1117704:                   // String '--' '|='
    case 1117705:                   // Real '--' '|='
    case 1134083:                   // Identifier '--' '||'
    case 1134084:                   // Null '--' '||'
    case 1134085:                   // True '--' '||'
    case 1134086:                   // False '--' '||'
    case 1134087:                   // Character '--' '||'
    case 1134088:                   // String '--' '||'
    case 1134089:                   // Real '--' '||'
    case 1150467:                   // Identifier '--' '}'
    case 1150468:                   // Null '--' '}'
    case 1150469:                   // True '--' '}'
    case 1150470:                   // False '--' '}'
    case 1150471:                   // Character '--' '}'
    case 1150472:                   // String '--' '}'
    case 1150473:                   // Real '--' '}'
    case 1166851:                   // Identifier '--' '~'
    case 1166852:                   // Null '--' '~'
    case 1166853:                   // True '--' '~'
    case 1166854:                   // False '--' '~'
    case 1166855:                   // Character '--' '~'
    case 1166856:                   // String '--' '~'
    case 1166857:                   // Real '--' '~'
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
      lookahead2W(26);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 2435:                    // Identifier '('
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 6019:                    // Identifier '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 3075:                    // Identifier '++'
      case 3587:                    // Identifier '--'
        lookahead3W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        break;
      case 3843:                    // Identifier '->'
      case 3971:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    case 19:                        // '('
      lookahead2W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 403:                     // '(' Identifier
        lookahead3W(22);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' | '^' |
                                    // '^=' | '|' | '|=' | '||'
        break;
      case 6035:                    // '(' '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 1299:                    // '(' Comment
      case 4499:                    // '(' ';'
        lookahead3W(1);             // WhiteSpace^token | ')'
        break;
      case 1555:                    // '(' '!'
      case 3091:                    // '(' '++'
      case 3603:                    // '(' '--'
      case 9107:                    // '(' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 531:                     // '(' Null
      case 659:                     // '(' True
      case 787:                     // '(' False
      case 915:                     // '(' Character
      case 1043:                    // '(' String
      case 1171:                    // '(' Real
        lookahead3W(17);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 6547:                    // '(' 'auto'
      case 6803:                    // '(' 'const'
      case 7059:                    // '(' 'extern'
      case 7571:                    // '(' 'register'
      case 7827:                    // '(' 'signed'
      case 7955:                    // '(' 'static'
      case 8083:                    // '(' 'unsigned'
      case 8339:                    // '(' 'volatile'
        lookahead3W(10);            // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
        break;
      case 2451:                    // '(' '('
      case 6675:                    // '(' 'char'
      case 6931:                    // '(' 'double'
      case 7187:                    // '(' 'float'
      case 7315:                    // '(' 'int'
      case 7443:                    // '(' 'long'
      case 7699:                    // '(' 'short'
      case 8211:                    // '(' 'void'
      case 8467:                    // '(' '{'
        lookahead3W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    case 47:                        // '['
      lookahead2W(14);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 431:                     // '[' Identifier
        lookahead3W(24);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
        break;
      case 1327:                    // '[' Comment
        lookahead3W(7);             // WhiteSpace^token | ',' | ';' | ']'
        break;
      case 4527:                    // '[' ';'
        lookahead3W(16);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 6063:                    // '[' '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 6191:                    // '[' ']'
        lookahead3W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        break;
      case 1583:                    // '[' '!'
      case 3119:                    // '[' '++'
      case 3631:                    // '[' '--'
      case 9135:                    // '[' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 559:                     // '[' Null
      case 687:                     // '[' True
      case 815:                     // '[' False
      case 943:                     // '[' Character
      case 1071:                    // '[' String
      case 1199:                    // '[' Real
        lookahead3W(21);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
        break;
      case 6575:                    // '[' 'auto'
      case 6831:                    // '[' 'const'
      case 7087:                    // '[' 'extern'
      case 7599:                    // '[' 'register'
      case 7855:                    // '[' 'signed'
      case 7983:                    // '[' 'static'
      case 8111:                    // '[' 'unsigned'
      case 8367:                    // '[' 'volatile'
        lookahead3W(10);            // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
        break;
      case 2479:                    // '[' '('
      case 6703:                    // '[' 'char'
      case 6959:                    // '[' 'double'
      case 7215:                    // '[' 'float'
      case 7343:                    // '[' 'int'
      case 7471:                    // '[' 'long'
      case 7727:                    // '[' 'short'
      case 8239:                    // '[' 'void'
      case 8495:                    // '[' '{'
        lookahead3W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    case 66:                        // '{'
      lookahead2W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 450:                     // '{' Identifier
        lookahead3W(23);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
        break;
      case 1090:                    // '{' String
        lookahead3W(20);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
        break;
      case 6082:                    // '{' '['
        lookahead3W(14);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 1346:                    // '{' Comment
      case 4546:                    // '{' ';'
        lookahead3W(5);             // WhiteSpace^token | ',' | '}'
        break;
      case 1602:                    // '{' '!'
      case 3138:                    // '{' '++'
      case 3650:                    // '{' '--'
      case 9154:                    // '{' '~'
        lookahead3W(8);             // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
        break;
      case 578:                     // '{' Null
      case 706:                     // '{' True
      case 834:                     // '{' False
      case 962:                     // '{' Character
      case 1218:                    // '{' Real
        lookahead3W(19);            // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | '<' | '<<' | '<<=' | '<=' |
                                    // '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' | '||' |
                                    // '}'
        break;
      case 6594:                    // '{' 'auto'
      case 6850:                    // '{' 'const'
      case 7106:                    // '{' 'extern'
      case 7618:                    // '{' 'register'
      case 7874:                    // '{' 'signed'
      case 8002:                    // '{' 'static'
      case 8130:                    // '{' 'unsigned'
      case 8386:                    // '{' 'volatile'
        lookahead3W(10);            // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
        break;
      case 2498:                    // '{' '('
      case 6722:                    // '{' 'char'
      case 6978:                    // '{' 'double'
      case 7234:                    // '{' 'float'
      case 7362:                    // '{' 'int'
      case 7490:                    // '{' 'long'
      case 7746:                    // '{' 'short'
      case 8258:                    // '{' 'void'
      case 8514:                    // '{' '{'
        lookahead3W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    case 4:                         // Null
    case 5:                         // True
    case 6:                         // False
    case 7:                         // Character
    case 8:                         // String
    case 9:                         // Real
      lookahead2W(25);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 3076:                    // Null '++'
      case 3588:                    // Null '--'
      case 3077:                    // True '++'
      case 3589:                    // True '--'
      case 3078:                    // False '++'
      case 3590:                    // False '--'
      case 3079:                    // Character '++'
      case 3591:                    // Character '--'
      case 3080:                    // String '++'
      case 3592:                    // String '--'
      case 3081:                    // Real '++'
      case 3593:                    // Real '--'
        lookahead3W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk != 12                    // '!'
     && lk != 24                    // '++'
     && lk != 28                    // '--'
     && lk != 71                    // '~'
     && lk != 131                   // Identifier END
     && lk != 132                   // Null END
     && lk != 133                   // True END
     && lk != 134                   // False END
     && lk != 135                   // Character END
     && lk != 136                   // String END
     && lk != 137                   // Real END
     && lk != 387                   // Identifier Identifier
     && lk != 388                   // Null Identifier
     && lk != 389                   // True Identifier
     && lk != 390                   // False Identifier
     && lk != 391                   // Character Identifier
     && lk != 392                   // String Identifier
     && lk != 393                   // Real Identifier
     && lk != 515                   // Identifier Null
     && lk != 516                   // Null Null
     && lk != 517                   // True Null
     && lk != 518                   // False Null
     && lk != 519                   // Character Null
     && lk != 520                   // String Null
     && lk != 521                   // Real Null
     && lk != 643                   // Identifier True
     && lk != 644                   // Null True
     && lk != 645                   // True True
     && lk != 646                   // False True
     && lk != 647                   // Character True
     && lk != 648                   // String True
     && lk != 649                   // Real True
     && lk != 771                   // Identifier False
     && lk != 772                   // Null False
     && lk != 773                   // True False
     && lk != 774                   // False False
     && lk != 775                   // Character False
     && lk != 776                   // String False
     && lk != 777                   // Real False
     && lk != 899                   // Identifier Character
     && lk != 900                   // Null Character
     && lk != 901                   // True Character
     && lk != 902                   // False Character
     && lk != 903                   // Character Character
     && lk != 904                   // String Character
     && lk != 905                   // Real Character
     && lk != 1027                  // Identifier String
     && lk != 1028                  // Null String
     && lk != 1029                  // True String
     && lk != 1030                  // False String
     && lk != 1031                  // Character String
     && lk != 1032                  // String String
     && lk != 1033                  // Real String
     && lk != 1155                  // Identifier Real
     && lk != 1156                  // Null Real
     && lk != 1157                  // True Real
     && lk != 1158                  // False Real
     && lk != 1159                  // Character Real
     && lk != 1160                  // String Real
     && lk != 1161                  // Real Real
     && lk != 1283                  // Identifier Comment
     && lk != 1284                  // Null Comment
     && lk != 1285                  // True Comment
     && lk != 1286                  // False Comment
     && lk != 1287                  // Character Comment
     && lk != 1288                  // String Comment
     && lk != 1289                  // Real Comment
     && lk != 1539                  // Identifier '!'
     && lk != 1540                  // Null '!'
     && lk != 1541                  // True '!'
     && lk != 1542                  // False '!'
     && lk != 1543                  // Character '!'
     && lk != 1544                  // String '!'
     && lk != 1545                  // Real '!'
     && lk != 1667                  // Identifier '!='
     && lk != 1668                  // Null '!='
     && lk != 1669                  // True '!='
     && lk != 1670                  // False '!='
     && lk != 1671                  // Character '!='
     && lk != 1672                  // String '!='
     && lk != 1673                  // Real '!='
     && lk != 1795                  // Identifier '%'
     && lk != 1796                  // Null '%'
     && lk != 1797                  // True '%'
     && lk != 1798                  // False '%'
     && lk != 1799                  // Character '%'
     && lk != 1800                  // String '%'
     && lk != 1801                  // Real '%'
     && lk != 1923                  // Identifier '%='
     && lk != 1924                  // Null '%='
     && lk != 1925                  // True '%='
     && lk != 1926                  // False '%='
     && lk != 1927                  // Character '%='
     && lk != 1928                  // String '%='
     && lk != 1929                  // Real '%='
     && lk != 2051                  // Identifier '&'
     && lk != 2052                  // Null '&'
     && lk != 2053                  // True '&'
     && lk != 2054                  // False '&'
     && lk != 2055                  // Character '&'
     && lk != 2056                  // String '&'
     && lk != 2057                  // Real '&'
     && lk != 2179                  // Identifier '&&'
     && lk != 2180                  // Null '&&'
     && lk != 2181                  // True '&&'
     && lk != 2182                  // False '&&'
     && lk != 2183                  // Character '&&'
     && lk != 2184                  // String '&&'
     && lk != 2185                  // Real '&&'
     && lk != 2307                  // Identifier '&='
     && lk != 2308                  // Null '&='
     && lk != 2309                  // True '&='
     && lk != 2310                  // False '&='
     && lk != 2311                  // Character '&='
     && lk != 2312                  // String '&='
     && lk != 2313                  // Real '&='
     && lk != 2436                  // Null '('
     && lk != 2437                  // True '('
     && lk != 2438                  // False '('
     && lk != 2439                  // Character '('
     && lk != 2440                  // String '('
     && lk != 2441                  // Real '('
     && lk != 2563                  // Identifier ')'
     && lk != 2564                  // Null ')'
     && lk != 2565                  // True ')'
     && lk != 2566                  // False ')'
     && lk != 2567                  // Character ')'
     && lk != 2568                  // String ')'
     && lk != 2569                  // Real ')'
     && lk != 2691                  // Identifier '*'
     && lk != 2692                  // Null '*'
     && lk != 2693                  // True '*'
     && lk != 2694                  // False '*'
     && lk != 2695                  // Character '*'
     && lk != 2696                  // String '*'
     && lk != 2697                  // Real '*'
     && lk != 2819                  // Identifier '*='
     && lk != 2820                  // Null '*='
     && lk != 2821                  // True '*='
     && lk != 2822                  // False '*='
     && lk != 2823                  // Character '*='
     && lk != 2824                  // String '*='
     && lk != 2825                  // Real '*='
     && lk != 2947                  // Identifier '+'
     && lk != 2948                  // Null '+'
     && lk != 2949                  // True '+'
     && lk != 2950                  // False '+'
     && lk != 2951                  // Character '+'
     && lk != 2952                  // String '+'
     && lk != 2953                  // Real '+'
     && lk != 3203                  // Identifier '+='
     && lk != 3204                  // Null '+='
     && lk != 3205                  // True '+='
     && lk != 3206                  // False '+='
     && lk != 3207                  // Character '+='
     && lk != 3208                  // String '+='
     && lk != 3209                  // Real '+='
     && lk != 3331                  // Identifier ','
     && lk != 3332                  // Null ','
     && lk != 3333                  // True ','
     && lk != 3334                  // False ','
     && lk != 3335                  // Character ','
     && lk != 3336                  // String ','
     && lk != 3337                  // Real ','
     && lk != 3459                  // Identifier '-'
     && lk != 3460                  // Null '-'
     && lk != 3461                  // True '-'
     && lk != 3462                  // False '-'
     && lk != 3463                  // Character '-'
     && lk != 3464                  // String '-'
     && lk != 3465                  // Real '-'
     && lk != 3715                  // Identifier '-='
     && lk != 3716                  // Null '-='
     && lk != 3717                  // True '-='
     && lk != 3718                  // False '-='
     && lk != 3719                  // Character '-='
     && lk != 3720                  // String '-='
     && lk != 3721                  // Real '-='
     && lk != 4099                  // Identifier '/'
     && lk != 4100                  // Null '/'
     && lk != 4101                  // True '/'
     && lk != 4102                  // False '/'
     && lk != 4103                  // Character '/'
     && lk != 4104                  // String '/'
     && lk != 4105                  // Real '/'
     && lk != 4227                  // Identifier '/='
     && lk != 4228                  // Null '/='
     && lk != 4229                  // True '/='
     && lk != 4230                  // False '/='
     && lk != 4231                  // Character '/='
     && lk != 4232                  // String '/='
     && lk != 4233                  // Real '/='
     && lk != 4355                  // Identifier ':'
     && lk != 4356                  // Null ':'
     && lk != 4357                  // True ':'
     && lk != 4358                  // False ':'
     && lk != 4359                  // Character ':'
     && lk != 4360                  // String ':'
     && lk != 4361                  // Real ':'
     && lk != 4483                  // Identifier ';'
     && lk != 4484                  // Null ';'
     && lk != 4485                  // True ';'
     && lk != 4486                  // False ';'
     && lk != 4487                  // Character ';'
     && lk != 4488                  // String ';'
     && lk != 4489                  // Real ';'
     && lk != 4611                  // Identifier '<'
     && lk != 4612                  // Null '<'
     && lk != 4613                  // True '<'
     && lk != 4614                  // False '<'
     && lk != 4615                  // Character '<'
     && lk != 4616                  // String '<'
     && lk != 4617                  // Real '<'
     && lk != 4739                  // Identifier '<<'
     && lk != 4740                  // Null '<<'
     && lk != 4741                  // True '<<'
     && lk != 4742                  // False '<<'
     && lk != 4743                  // Character '<<'
     && lk != 4744                  // String '<<'
     && lk != 4745                  // Real '<<'
     && lk != 4867                  // Identifier '<<='
     && lk != 4868                  // Null '<<='
     && lk != 4869                  // True '<<='
     && lk != 4870                  // False '<<='
     && lk != 4871                  // Character '<<='
     && lk != 4872                  // String '<<='
     && lk != 4873                  // Real '<<='
     && lk != 4995                  // Identifier '<='
     && lk != 4996                  // Null '<='
     && lk != 4997                  // True '<='
     && lk != 4998                  // False '<='
     && lk != 4999                  // Character '<='
     && lk != 5000                  // String '<='
     && lk != 5001                  // Real '<='
     && lk != 5123                  // Identifier '='
     && lk != 5124                  // Null '='
     && lk != 5125                  // True '='
     && lk != 5126                  // False '='
     && lk != 5127                  // Character '='
     && lk != 5128                  // String '='
     && lk != 5129                  // Real '='
     && lk != 5251                  // Identifier '=='
     && lk != 5252                  // Null '=='
     && lk != 5253                  // True '=='
     && lk != 5254                  // False '=='
     && lk != 5255                  // Character '=='
     && lk != 5256                  // String '=='
     && lk != 5257                  // Real '=='
     && lk != 5379                  // Identifier '>'
     && lk != 5380                  // Null '>'
     && lk != 5381                  // True '>'
     && lk != 5382                  // False '>'
     && lk != 5383                  // Character '>'
     && lk != 5384                  // String '>'
     && lk != 5385                  // Real '>'
     && lk != 5507                  // Identifier '>='
     && lk != 5508                  // Null '>='
     && lk != 5509                  // True '>='
     && lk != 5510                  // False '>='
     && lk != 5511                  // Character '>='
     && lk != 5512                  // String '>='
     && lk != 5513                  // Real '>='
     && lk != 5635                  // Identifier '>>'
     && lk != 5636                  // Null '>>'
     && lk != 5637                  // True '>>'
     && lk != 5638                  // False '>>'
     && lk != 5639                  // Character '>>'
     && lk != 5640                  // String '>>'
     && lk != 5641                  // Real '>>'
     && lk != 5763                  // Identifier '>>='
     && lk != 5764                  // Null '>>='
     && lk != 5765                  // True '>>='
     && lk != 5766                  // False '>>='
     && lk != 5767                  // Character '>>='
     && lk != 5768                  // String '>>='
     && lk != 5769                  // Real '>>='
     && lk != 5891                  // Identifier '?'
     && lk != 5892                  // Null '?'
     && lk != 5893                  // True '?'
     && lk != 5894                  // False '?'
     && lk != 5895                  // Character '?'
     && lk != 5896                  // String '?'
     && lk != 5897                  // Real '?'
     && lk != 6020                  // Null '['
     && lk != 6021                  // True '['
     && lk != 6022                  // False '['
     && lk != 6023                  // Character '['
     && lk != 6024                  // String '['
     && lk != 6025                  // Real '['
     && lk != 6147                  // Identifier ']'
     && lk != 6148                  // Null ']'
     && lk != 6149                  // True ']'
     && lk != 6150                  // False ']'
     && lk != 6151                  // Character ']'
     && lk != 6152                  // String ']'
     && lk != 6153                  // Real ']'
     && lk != 6275                  // Identifier '^'
     && lk != 6276                  // Null '^'
     && lk != 6277                  // True '^'
     && lk != 6278                  // False '^'
     && lk != 6279                  // Character '^'
     && lk != 6280                  // String '^'
     && lk != 6281                  // Real '^'
     && lk != 6403                  // Identifier '^='
     && lk != 6404                  // Null '^='
     && lk != 6405                  // True '^='
     && lk != 6406                  // False '^='
     && lk != 6407                  // Character '^='
     && lk != 6408                  // String '^='
     && lk != 6409                  // Real '^='
     && lk != 6531                  // Identifier 'auto'
     && lk != 6532                  // Null 'auto'
     && lk != 6533                  // True 'auto'
     && lk != 6534                  // False 'auto'
     && lk != 6535                  // Character 'auto'
     && lk != 6536                  // String 'auto'
     && lk != 6537                  // Real 'auto'
     && lk != 6659                  // Identifier 'char'
     && lk != 6660                  // Null 'char'
     && lk != 6661                  // True 'char'
     && lk != 6662                  // False 'char'
     && lk != 6663                  // Character 'char'
     && lk != 6664                  // String 'char'
     && lk != 6665                  // Real 'char'
     && lk != 6787                  // Identifier 'const'
     && lk != 6788                  // Null 'const'
     && lk != 6789                  // True 'const'
     && lk != 6790                  // False 'const'
     && lk != 6791                  // Character 'const'
     && lk != 6792                  // String 'const'
     && lk != 6793                  // Real 'const'
     && lk != 6915                  // Identifier 'double'
     && lk != 6916                  // Null 'double'
     && lk != 6917                  // True 'double'
     && lk != 6918                  // False 'double'
     && lk != 6919                  // Character 'double'
     && lk != 6920                  // String 'double'
     && lk != 6921                  // Real 'double'
     && lk != 7043                  // Identifier 'extern'
     && lk != 7044                  // Null 'extern'
     && lk != 7045                  // True 'extern'
     && lk != 7046                  // False 'extern'
     && lk != 7047                  // Character 'extern'
     && lk != 7048                  // String 'extern'
     && lk != 7049                  // Real 'extern'
     && lk != 7171                  // Identifier 'float'
     && lk != 7172                  // Null 'float'
     && lk != 7173                  // True 'float'
     && lk != 7174                  // False 'float'
     && lk != 7175                  // Character 'float'
     && lk != 7176                  // String 'float'
     && lk != 7177                  // Real 'float'
     && lk != 7299                  // Identifier 'int'
     && lk != 7300                  // Null 'int'
     && lk != 7301                  // True 'int'
     && lk != 7302                  // False 'int'
     && lk != 7303                  // Character 'int'
     && lk != 7304                  // String 'int'
     && lk != 7305                  // Real 'int'
     && lk != 7427                  // Identifier 'long'
     && lk != 7428                  // Null 'long'
     && lk != 7429                  // True 'long'
     && lk != 7430                  // False 'long'
     && lk != 7431                  // Character 'long'
     && lk != 7432                  // String 'long'
     && lk != 7433                  // Real 'long'
     && lk != 7555                  // Identifier 'register'
     && lk != 7556                  // Null 'register'
     && lk != 7557                  // True 'register'
     && lk != 7558                  // False 'register'
     && lk != 7559                  // Character 'register'
     && lk != 7560                  // String 'register'
     && lk != 7561                  // Real 'register'
     && lk != 7683                  // Identifier 'short'
     && lk != 7684                  // Null 'short'
     && lk != 7685                  // True 'short'
     && lk != 7686                  // False 'short'
     && lk != 7687                  // Character 'short'
     && lk != 7688                  // String 'short'
     && lk != 7689                  // Real 'short'
     && lk != 7811                  // Identifier 'signed'
     && lk != 7812                  // Null 'signed'
     && lk != 7813                  // True 'signed'
     && lk != 7814                  // False 'signed'
     && lk != 7815                  // Character 'signed'
     && lk != 7816                  // String 'signed'
     && lk != 7817                  // Real 'signed'
     && lk != 7939                  // Identifier 'static'
     && lk != 7940                  // Null 'static'
     && lk != 7941                  // True 'static'
     && lk != 7942                  // False 'static'
     && lk != 7943                  // Character 'static'
     && lk != 7944                  // String 'static'
     && lk != 7945                  // Real 'static'
     && lk != 8067                  // Identifier 'unsigned'
     && lk != 8068                  // Null 'unsigned'
     && lk != 8069                  // True 'unsigned'
     && lk != 8070                  // False 'unsigned'
     && lk != 8071                  // Character 'unsigned'
     && lk != 8072                  // String 'unsigned'
     && lk != 8073                  // Real 'unsigned'
     && lk != 8195                  // Identifier 'void'
     && lk != 8196                  // Null 'void'
     && lk != 8197                  // True 'void'
     && lk != 8198                  // False 'void'
     && lk != 8199                  // Character 'void'
     && lk != 8200                  // String 'void'
     && lk != 8201                  // Real 'void'
     && lk != 8323                  // Identifier 'volatile'
     && lk != 8324                  // Null 'volatile'
     && lk != 8325                  // True 'volatile'
     && lk != 8326                  // False 'volatile'
     && lk != 8327                  // Character 'volatile'
     && lk != 8328                  // String 'volatile'
     && lk != 8329                  // Real 'volatile'
     && lk != 8451                  // Identifier '{'
     && lk != 8452                  // Null '{'
     && lk != 8453                  // True '{'
     && lk != 8454                  // False '{'
     && lk != 8455                  // Character '{'
     && lk != 8456                  // String '{'
     && lk != 8457                  // Real '{'
     && lk != 8579                  // Identifier '|'
     && lk != 8580                  // Null '|'
     && lk != 8581                  // True '|'
     && lk != 8582                  // False '|'
     && lk != 8583                  // Character '|'
     && lk != 8584                  // String '|'
     && lk != 8585                  // Real '|'
     && lk != 8707                  // Identifier '|='
     && lk != 8708                  // Null '|='
     && lk != 8709                  // True '|='
     && lk != 8710                  // False '|='
     && lk != 8711                  // Character '|='
     && lk != 8712                  // String '|='
     && lk != 8713                  // Real '|='
     && lk != 8835                  // Identifier '||'
     && lk != 8836                  // Null '||'
     && lk != 8837                  // True '||'
     && lk != 8838                  // False '||'
     && lk != 8839                  // Character '||'
     && lk != 8840                  // String '||'
     && lk != 8841                  // Real '||'
     && lk != 8963                  // Identifier '}'
     && lk != 8964                  // Null '}'
     && lk != 8965                  // True '}'
     && lk != 8966                  // False '}'
     && lk != 8967                  // Character '}'
     && lk != 8968                  // String '}'
     && lk != 8969                  // Real '}'
     && lk != 9091                  // Identifier '~'
     && lk != 9092                  // Null '~'
     && lk != 9093                  // True '~'
     && lk != 9094                  // False '~'
     && lk != 9095                  // Character '~'
     && lk != 9096                  // String '~'
     && lk != 9097                  // Real '~'
     && lk != 19459                 // Identifier '++' END
     && lk != 19460                 // Null '++' END
     && lk != 19461                 // True '++' END
     && lk != 19462                 // False '++' END
     && lk != 19463                 // Character '++' END
     && lk != 19464                 // String '++' END
     && lk != 19465                 // Real '++' END
     && lk != 19971                 // Identifier '--' END
     && lk != 19972                 // Null '--' END
     && lk != 19973                 // True '--' END
     && lk != 19974                 // False '--' END
     && lk != 19975                 // Character '--' END
     && lk != 19976                 // String '--' END
     && lk != 19977                 // Real '--' END
     && lk != 22575                 // '[' ']' END
     && lk != 55343                 // '[' ']' Identifier
     && lk != 71727                 // '[' ']' Null
     && lk != 88111                 // '[' ']' True
     && lk != 104495                // '[' ']' False
     && lk != 120879                // '[' ']' Character
     && lk != 137263                // '[' ']' String
     && lk != 153647                // '[' ']' Real
     && lk != 166915                // Identifier '++' Comment
     && lk != 166916                // Null '++' Comment
     && lk != 166917                // True '++' Comment
     && lk != 166918                // False '++' Comment
     && lk != 166919                // Character '++' Comment
     && lk != 166920                // String '++' Comment
     && lk != 166921                // Real '++' Comment
     && lk != 167427                // Identifier '--' Comment
     && lk != 167428                // Null '--' Comment
     && lk != 167429                // True '--' Comment
     && lk != 167430                // False '--' Comment
     && lk != 167431                // Character '--' Comment
     && lk != 167432                // String '--' Comment
     && lk != 167433                // Real '--' Comment
     && lk != 170031                // '[' ']' Comment
     && lk != 199683                // Identifier '++' '!'
     && lk != 199684                // Null '++' '!'
     && lk != 199685                // True '++' '!'
     && lk != 199686                // False '++' '!'
     && lk != 199687                // Character '++' '!'
     && lk != 199688                // String '++' '!'
     && lk != 199689                // Real '++' '!'
     && lk != 200195                // Identifier '--' '!'
     && lk != 200196                // Null '--' '!'
     && lk != 200197                // True '--' '!'
     && lk != 200198                // False '--' '!'
     && lk != 200199                // Character '--' '!'
     && lk != 200200                // String '--' '!'
     && lk != 200201                // Real '--' '!'
     && lk != 202799                // '[' ']' '!'
     && lk != 216067                // Identifier '++' '!='
     && lk != 216068                // Null '++' '!='
     && lk != 216069                // True '++' '!='
     && lk != 216070                // False '++' '!='
     && lk != 216071                // Character '++' '!='
     && lk != 216072                // String '++' '!='
     && lk != 216073                // Real '++' '!='
     && lk != 216579                // Identifier '--' '!='
     && lk != 216580                // Null '--' '!='
     && lk != 216581                // True '--' '!='
     && lk != 216582                // False '--' '!='
     && lk != 216583                // Character '--' '!='
     && lk != 216584                // String '--' '!='
     && lk != 216585                // Real '--' '!='
     && lk != 219183                // '[' ']' '!='
     && lk != 232451                // Identifier '++' '%'
     && lk != 232452                // Null '++' '%'
     && lk != 232453                // True '++' '%'
     && lk != 232454                // False '++' '%'
     && lk != 232455                // Character '++' '%'
     && lk != 232456                // String '++' '%'
     && lk != 232457                // Real '++' '%'
     && lk != 232963                // Identifier '--' '%'
     && lk != 232964                // Null '--' '%'
     && lk != 232965                // True '--' '%'
     && lk != 232966                // False '--' '%'
     && lk != 232967                // Character '--' '%'
     && lk != 232968                // String '--' '%'
     && lk != 232969                // Real '--' '%'
     && lk != 235567                // '[' ']' '%'
     && lk != 248835                // Identifier '++' '%='
     && lk != 248836                // Null '++' '%='
     && lk != 248837                // True '++' '%='
     && lk != 248838                // False '++' '%='
     && lk != 248839                // Character '++' '%='
     && lk != 248840                // String '++' '%='
     && lk != 248841                // Real '++' '%='
     && lk != 249347                // Identifier '--' '%='
     && lk != 249348                // Null '--' '%='
     && lk != 249349                // True '--' '%='
     && lk != 249350                // False '--' '%='
     && lk != 249351                // Character '--' '%='
     && lk != 249352                // String '--' '%='
     && lk != 249353                // Real '--' '%='
     && lk != 251951                // '[' ']' '%='
     && lk != 265219                // Identifier '++' '&'
     && lk != 265220                // Null '++' '&'
     && lk != 265221                // True '++' '&'
     && lk != 265222                // False '++' '&'
     && lk != 265223                // Character '++' '&'
     && lk != 265224                // String '++' '&'
     && lk != 265225                // Real '++' '&'
     && lk != 265731                // Identifier '--' '&'
     && lk != 265732                // Null '--' '&'
     && lk != 265733                // True '--' '&'
     && lk != 265734                // False '--' '&'
     && lk != 265735                // Character '--' '&'
     && lk != 265736                // String '--' '&'
     && lk != 265737                // Real '--' '&'
     && lk != 268335                // '[' ']' '&'
     && lk != 281603                // Identifier '++' '&&'
     && lk != 281604                // Null '++' '&&'
     && lk != 281605                // True '++' '&&'
     && lk != 281606                // False '++' '&&'
     && lk != 281607                // Character '++' '&&'
     && lk != 281608                // String '++' '&&'
     && lk != 281609                // Real '++' '&&'
     && lk != 282115                // Identifier '--' '&&'
     && lk != 282116                // Null '--' '&&'
     && lk != 282117                // True '--' '&&'
     && lk != 282118                // False '--' '&&'
     && lk != 282119                // Character '--' '&&'
     && lk != 282120                // String '--' '&&'
     && lk != 282121                // Real '--' '&&'
     && lk != 284719                // '[' ']' '&&'
     && lk != 297987                // Identifier '++' '&='
     && lk != 297988                // Null '++' '&='
     && lk != 297989                // True '++' '&='
     && lk != 297990                // False '++' '&='
     && lk != 297991                // Character '++' '&='
     && lk != 297992                // String '++' '&='
     && lk != 297993                // Real '++' '&='
     && lk != 298499                // Identifier '--' '&='
     && lk != 298500                // Null '--' '&='
     && lk != 298501                // True '--' '&='
     && lk != 298502                // False '--' '&='
     && lk != 298503                // Character '--' '&='
     && lk != 298504                // String '--' '&='
     && lk != 298505                // Real '--' '&='
     && lk != 301103                // '[' ']' '&='
     && lk != 317487                // '[' ']' '('
     && lk != 330755                // Identifier '++' ')'
     && lk != 330756                // Null '++' ')'
     && lk != 330757                // True '++' ')'
     && lk != 330758                // False '++' ')'
     && lk != 330759                // Character '++' ')'
     && lk != 330760                // String '++' ')'
     && lk != 330761                // Real '++' ')'
     && lk != 331267                // Identifier '--' ')'
     && lk != 331268                // Null '--' ')'
     && lk != 331269                // True '--' ')'
     && lk != 331270                // False '--' ')'
     && lk != 331271                // Character '--' ')'
     && lk != 331272                // String '--' ')'
     && lk != 331273                // Real '--' ')'
     && lk != 333871                // '[' ']' ')'
     && lk != 347139                // Identifier '++' '*'
     && lk != 347140                // Null '++' '*'
     && lk != 347141                // True '++' '*'
     && lk != 347142                // False '++' '*'
     && lk != 347143                // Character '++' '*'
     && lk != 347144                // String '++' '*'
     && lk != 347145                // Real '++' '*'
     && lk != 347651                // Identifier '--' '*'
     && lk != 347652                // Null '--' '*'
     && lk != 347653                // True '--' '*'
     && lk != 347654                // False '--' '*'
     && lk != 347655                // Character '--' '*'
     && lk != 347656                // String '--' '*'
     && lk != 347657                // Real '--' '*'
     && lk != 350255                // '[' ']' '*'
     && lk != 363523                // Identifier '++' '*='
     && lk != 363524                // Null '++' '*='
     && lk != 363525                // True '++' '*='
     && lk != 363526                // False '++' '*='
     && lk != 363527                // Character '++' '*='
     && lk != 363528                // String '++' '*='
     && lk != 363529                // Real '++' '*='
     && lk != 364035                // Identifier '--' '*='
     && lk != 364036                // Null '--' '*='
     && lk != 364037                // True '--' '*='
     && lk != 364038                // False '--' '*='
     && lk != 364039                // Character '--' '*='
     && lk != 364040                // String '--' '*='
     && lk != 364041                // Real '--' '*='
     && lk != 366639                // '[' ']' '*='
     && lk != 379907                // Identifier '++' '+'
     && lk != 379908                // Null '++' '+'
     && lk != 379909                // True '++' '+'
     && lk != 379910                // False '++' '+'
     && lk != 379911                // Character '++' '+'
     && lk != 379912                // String '++' '+'
     && lk != 379913                // Real '++' '+'
     && lk != 380419                // Identifier '--' '+'
     && lk != 380420                // Null '--' '+'
     && lk != 380421                // True '--' '+'
     && lk != 380422                // False '--' '+'
     && lk != 380423                // Character '--' '+'
     && lk != 380424                // String '--' '+'
     && lk != 380425                // Real '--' '+'
     && lk != 383023                // '[' ']' '+'
     && lk != 396291                // Identifier '++' '++'
     && lk != 396292                // Null '++' '++'
     && lk != 396293                // True '++' '++'
     && lk != 396294                // False '++' '++'
     && lk != 396295                // Character '++' '++'
     && lk != 396296                // String '++' '++'
     && lk != 396297                // Real '++' '++'
     && lk != 396803                // Identifier '--' '++'
     && lk != 396804                // Null '--' '++'
     && lk != 396805                // True '--' '++'
     && lk != 396806                // False '--' '++'
     && lk != 396807                // Character '--' '++'
     && lk != 396808                // String '--' '++'
     && lk != 396809                // Real '--' '++'
     && lk != 412675                // Identifier '++' '+='
     && lk != 412676                // Null '++' '+='
     && lk != 412677                // True '++' '+='
     && lk != 412678                // False '++' '+='
     && lk != 412679                // Character '++' '+='
     && lk != 412680                // String '++' '+='
     && lk != 412681                // Real '++' '+='
     && lk != 413187                // Identifier '--' '+='
     && lk != 413188                // Null '--' '+='
     && lk != 413189                // True '--' '+='
     && lk != 413190                // False '--' '+='
     && lk != 413191                // Character '--' '+='
     && lk != 413192                // String '--' '+='
     && lk != 413193                // Real '--' '+='
     && lk != 415791                // '[' ']' '+='
     && lk != 429059                // Identifier '++' ','
     && lk != 429060                // Null '++' ','
     && lk != 429061                // True '++' ','
     && lk != 429062                // False '++' ','
     && lk != 429063                // Character '++' ','
     && lk != 429064                // String '++' ','
     && lk != 429065                // Real '++' ','
     && lk != 429571                // Identifier '--' ','
     && lk != 429572                // Null '--' ','
     && lk != 429573                // True '--' ','
     && lk != 429574                // False '--' ','
     && lk != 429575                // Character '--' ','
     && lk != 429576                // String '--' ','
     && lk != 429577                // Real '--' ','
     && lk != 432175                // '[' ']' ','
     && lk != 445443                // Identifier '++' '-'
     && lk != 445444                // Null '++' '-'
     && lk != 445445                // True '++' '-'
     && lk != 445446                // False '++' '-'
     && lk != 445447                // Character '++' '-'
     && lk != 445448                // String '++' '-'
     && lk != 445449                // Real '++' '-'
     && lk != 445955                // Identifier '--' '-'
     && lk != 445956                // Null '--' '-'
     && lk != 445957                // True '--' '-'
     && lk != 445958                // False '--' '-'
     && lk != 445959                // Character '--' '-'
     && lk != 445960                // String '--' '-'
     && lk != 445961                // Real '--' '-'
     && lk != 448559                // '[' ']' '-'
     && lk != 461827                // Identifier '++' '--'
     && lk != 461828                // Null '++' '--'
     && lk != 461829                // True '++' '--'
     && lk != 461830                // False '++' '--'
     && lk != 461831                // Character '++' '--'
     && lk != 461832                // String '++' '--'
     && lk != 461833                // Real '++' '--'
     && lk != 462339                // Identifier '--' '--'
     && lk != 462340                // Null '--' '--'
     && lk != 462341                // True '--' '--'
     && lk != 462342                // False '--' '--'
     && lk != 462343                // Character '--' '--'
     && lk != 462344                // String '--' '--'
     && lk != 462345                // Real '--' '--'
     && lk != 478211                // Identifier '++' '-='
     && lk != 478212                // Null '++' '-='
     && lk != 478213                // True '++' '-='
     && lk != 478214                // False '++' '-='
     && lk != 478215                // Character '++' '-='
     && lk != 478216                // String '++' '-='
     && lk != 478217                // Real '++' '-='
     && lk != 478723                // Identifier '--' '-='
     && lk != 478724                // Null '--' '-='
     && lk != 478725                // True '--' '-='
     && lk != 478726                // False '--' '-='
     && lk != 478727                // Character '--' '-='
     && lk != 478728                // String '--' '-='
     && lk != 478729                // Real '--' '-='
     && lk != 481327                // '[' ']' '-='
     && lk != 527363                // Identifier '++' '/'
     && lk != 527364                // Null '++' '/'
     && lk != 527365                // True '++' '/'
     && lk != 527366                // False '++' '/'
     && lk != 527367                // Character '++' '/'
     && lk != 527368                // String '++' '/'
     && lk != 527369                // Real '++' '/'
     && lk != 527875                // Identifier '--' '/'
     && lk != 527876                // Null '--' '/'
     && lk != 527877                // True '--' '/'
     && lk != 527878                // False '--' '/'
     && lk != 527879                // Character '--' '/'
     && lk != 527880                // String '--' '/'
     && lk != 527881                // Real '--' '/'
     && lk != 530479                // '[' ']' '/'
     && lk != 543747                // Identifier '++' '/='
     && lk != 543748                // Null '++' '/='
     && lk != 543749                // True '++' '/='
     && lk != 543750                // False '++' '/='
     && lk != 543751                // Character '++' '/='
     && lk != 543752                // String '++' '/='
     && lk != 543753                // Real '++' '/='
     && lk != 544259                // Identifier '--' '/='
     && lk != 544260                // Null '--' '/='
     && lk != 544261                // True '--' '/='
     && lk != 544262                // False '--' '/='
     && lk != 544263                // Character '--' '/='
     && lk != 544264                // String '--' '/='
     && lk != 544265                // Real '--' '/='
     && lk != 546863                // '[' ']' '/='
     && lk != 560131                // Identifier '++' ':'
     && lk != 560132                // Null '++' ':'
     && lk != 560133                // True '++' ':'
     && lk != 560134                // False '++' ':'
     && lk != 560135                // Character '++' ':'
     && lk != 560136                // String '++' ':'
     && lk != 560137                // Real '++' ':'
     && lk != 560643                // Identifier '--' ':'
     && lk != 560644                // Null '--' ':'
     && lk != 560645                // True '--' ':'
     && lk != 560646                // False '--' ':'
     && lk != 560647                // Character '--' ':'
     && lk != 560648                // String '--' ':'
     && lk != 560649                // Real '--' ':'
     && lk != 563247                // '[' ']' ':'
     && lk != 576515                // Identifier '++' ';'
     && lk != 576516                // Null '++' ';'
     && lk != 576517                // True '++' ';'
     && lk != 576518                // False '++' ';'
     && lk != 576519                // Character '++' ';'
     && lk != 576520                // String '++' ';'
     && lk != 576521                // Real '++' ';'
     && lk != 577027                // Identifier '--' ';'
     && lk != 577028                // Null '--' ';'
     && lk != 577029                // True '--' ';'
     && lk != 577030                // False '--' ';'
     && lk != 577031                // Character '--' ';'
     && lk != 577032                // String '--' ';'
     && lk != 577033                // Real '--' ';'
     && lk != 579631                // '[' ']' ';'
     && lk != 592899                // Identifier '++' '<'
     && lk != 592900                // Null '++' '<'
     && lk != 592901                // True '++' '<'
     && lk != 592902                // False '++' '<'
     && lk != 592903                // Character '++' '<'
     && lk != 592904                // String '++' '<'
     && lk != 592905                // Real '++' '<'
     && lk != 593411                // Identifier '--' '<'
     && lk != 593412                // Null '--' '<'
     && lk != 593413                // True '--' '<'
     && lk != 593414                // False '--' '<'
     && lk != 593415                // Character '--' '<'
     && lk != 593416                // String '--' '<'
     && lk != 593417                // Real '--' '<'
     && lk != 596015                // '[' ']' '<'
     && lk != 609283                // Identifier '++' '<<'
     && lk != 609284                // Null '++' '<<'
     && lk != 609285                // True '++' '<<'
     && lk != 609286                // False '++' '<<'
     && lk != 609287                // Character '++' '<<'
     && lk != 609288                // String '++' '<<'
     && lk != 609289                // Real '++' '<<'
     && lk != 609795                // Identifier '--' '<<'
     && lk != 609796                // Null '--' '<<'
     && lk != 609797                // True '--' '<<'
     && lk != 609798                // False '--' '<<'
     && lk != 609799                // Character '--' '<<'
     && lk != 609800                // String '--' '<<'
     && lk != 609801                // Real '--' '<<'
     && lk != 612399                // '[' ']' '<<'
     && lk != 625667                // Identifier '++' '<<='
     && lk != 625668                // Null '++' '<<='
     && lk != 625669                // True '++' '<<='
     && lk != 625670                // False '++' '<<='
     && lk != 625671                // Character '++' '<<='
     && lk != 625672                // String '++' '<<='
     && lk != 625673                // Real '++' '<<='
     && lk != 626179                // Identifier '--' '<<='
     && lk != 626180                // Null '--' '<<='
     && lk != 626181                // True '--' '<<='
     && lk != 626182                // False '--' '<<='
     && lk != 626183                // Character '--' '<<='
     && lk != 626184                // String '--' '<<='
     && lk != 626185                // Real '--' '<<='
     && lk != 628783                // '[' ']' '<<='
     && lk != 642051                // Identifier '++' '<='
     && lk != 642052                // Null '++' '<='
     && lk != 642053                // True '++' '<='
     && lk != 642054                // False '++' '<='
     && lk != 642055                // Character '++' '<='
     && lk != 642056                // String '++' '<='
     && lk != 642057                // Real '++' '<='
     && lk != 642563                // Identifier '--' '<='
     && lk != 642564                // Null '--' '<='
     && lk != 642565                // True '--' '<='
     && lk != 642566                // False '--' '<='
     && lk != 642567                // Character '--' '<='
     && lk != 642568                // String '--' '<='
     && lk != 642569                // Real '--' '<='
     && lk != 645167                // '[' ']' '<='
     && lk != 658435                // Identifier '++' '='
     && lk != 658436                // Null '++' '='
     && lk != 658437                // True '++' '='
     && lk != 658438                // False '++' '='
     && lk != 658439                // Character '++' '='
     && lk != 658440                // String '++' '='
     && lk != 658441                // Real '++' '='
     && lk != 658947                // Identifier '--' '='
     && lk != 658948                // Null '--' '='
     && lk != 658949                // True '--' '='
     && lk != 658950                // False '--' '='
     && lk != 658951                // Character '--' '='
     && lk != 658952                // String '--' '='
     && lk != 658953                // Real '--' '='
     && lk != 661551                // '[' ']' '='
     && lk != 674819                // Identifier '++' '=='
     && lk != 674820                // Null '++' '=='
     && lk != 674821                // True '++' '=='
     && lk != 674822                // False '++' '=='
     && lk != 674823                // Character '++' '=='
     && lk != 674824                // String '++' '=='
     && lk != 674825                // Real '++' '=='
     && lk != 675331                // Identifier '--' '=='
     && lk != 675332                // Null '--' '=='
     && lk != 675333                // True '--' '=='
     && lk != 675334                // False '--' '=='
     && lk != 675335                // Character '--' '=='
     && lk != 675336                // String '--' '=='
     && lk != 675337                // Real '--' '=='
     && lk != 677935                // '[' ']' '=='
     && lk != 691203                // Identifier '++' '>'
     && lk != 691204                // Null '++' '>'
     && lk != 691205                // True '++' '>'
     && lk != 691206                // False '++' '>'
     && lk != 691207                // Character '++' '>'
     && lk != 691208                // String '++' '>'
     && lk != 691209                // Real '++' '>'
     && lk != 691715                // Identifier '--' '>'
     && lk != 691716                // Null '--' '>'
     && lk != 691717                // True '--' '>'
     && lk != 691718                // False '--' '>'
     && lk != 691719                // Character '--' '>'
     && lk != 691720                // String '--' '>'
     && lk != 691721                // Real '--' '>'
     && lk != 694319                // '[' ']' '>'
     && lk != 707587                // Identifier '++' '>='
     && lk != 707588                // Null '++' '>='
     && lk != 707589                // True '++' '>='
     && lk != 707590                // False '++' '>='
     && lk != 707591                // Character '++' '>='
     && lk != 707592                // String '++' '>='
     && lk != 707593                // Real '++' '>='
     && lk != 708099                // Identifier '--' '>='
     && lk != 708100                // Null '--' '>='
     && lk != 708101                // True '--' '>='
     && lk != 708102                // False '--' '>='
     && lk != 708103                // Character '--' '>='
     && lk != 708104                // String '--' '>='
     && lk != 708105                // Real '--' '>='
     && lk != 710703                // '[' ']' '>='
     && lk != 723971                // Identifier '++' '>>'
     && lk != 723972                // Null '++' '>>'
     && lk != 723973                // True '++' '>>'
     && lk != 723974                // False '++' '>>'
     && lk != 723975                // Character '++' '>>'
     && lk != 723976                // String '++' '>>'
     && lk != 723977                // Real '++' '>>'
     && lk != 724483                // Identifier '--' '>>'
     && lk != 724484                // Null '--' '>>'
     && lk != 724485                // True '--' '>>'
     && lk != 724486                // False '--' '>>'
     && lk != 724487                // Character '--' '>>'
     && lk != 724488                // String '--' '>>'
     && lk != 724489                // Real '--' '>>'
     && lk != 727087                // '[' ']' '>>'
     && lk != 740355                // Identifier '++' '>>='
     && lk != 740356                // Null '++' '>>='
     && lk != 740357                // True '++' '>>='
     && lk != 740358                // False '++' '>>='
     && lk != 740359                // Character '++' '>>='
     && lk != 740360                // String '++' '>>='
     && lk != 740361                // Real '++' '>>='
     && lk != 740867                // Identifier '--' '>>='
     && lk != 740868                // Null '--' '>>='
     && lk != 740869                // True '--' '>>='
     && lk != 740870                // False '--' '>>='
     && lk != 740871                // Character '--' '>>='
     && lk != 740872                // String '--' '>>='
     && lk != 740873                // Real '--' '>>='
     && lk != 743471                // '[' ']' '>>='
     && lk != 756739                // Identifier '++' '?'
     && lk != 756740                // Null '++' '?'
     && lk != 756741                // True '++' '?'
     && lk != 756742                // False '++' '?'
     && lk != 756743                // Character '++' '?'
     && lk != 756744                // String '++' '?'
     && lk != 756745                // Real '++' '?'
     && lk != 757251                // Identifier '--' '?'
     && lk != 757252                // Null '--' '?'
     && lk != 757253                // True '--' '?'
     && lk != 757254                // False '--' '?'
     && lk != 757255                // Character '--' '?'
     && lk != 757256                // String '--' '?'
     && lk != 757257                // Real '--' '?'
     && lk != 759855                // '[' ']' '?'
     && lk != 776239                // '[' ']' '['
     && lk != 789507                // Identifier '++' ']'
     && lk != 789508                // Null '++' ']'
     && lk != 789509                // True '++' ']'
     && lk != 789510                // False '++' ']'
     && lk != 789511                // Character '++' ']'
     && lk != 789512                // String '++' ']'
     && lk != 789513                // Real '++' ']'
     && lk != 790019                // Identifier '--' ']'
     && lk != 790020                // Null '--' ']'
     && lk != 790021                // True '--' ']'
     && lk != 790022                // False '--' ']'
     && lk != 790023                // Character '--' ']'
     && lk != 790024                // String '--' ']'
     && lk != 790025                // Real '--' ']'
     && lk != 792451                // Identifier '[' ']'
     && lk != 792623                // '[' ']' ']'
     && lk != 805891                // Identifier '++' '^'
     && lk != 805892                // Null '++' '^'
     && lk != 805893                // True '++' '^'
     && lk != 805894                // False '++' '^'
     && lk != 805895                // Character '++' '^'
     && lk != 805896                // String '++' '^'
     && lk != 805897                // Real '++' '^'
     && lk != 806403                // Identifier '--' '^'
     && lk != 806404                // Null '--' '^'
     && lk != 806405                // True '--' '^'
     && lk != 806406                // False '--' '^'
     && lk != 806407                // Character '--' '^'
     && lk != 806408                // String '--' '^'
     && lk != 806409                // Real '--' '^'
     && lk != 809007                // '[' ']' '^'
     && lk != 822275                // Identifier '++' '^='
     && lk != 822276                // Null '++' '^='
     && lk != 822277                // True '++' '^='
     && lk != 822278                // False '++' '^='
     && lk != 822279                // Character '++' '^='
     && lk != 822280                // String '++' '^='
     && lk != 822281                // Real '++' '^='
     && lk != 822787                // Identifier '--' '^='
     && lk != 822788                // Null '--' '^='
     && lk != 822789                // True '--' '^='
     && lk != 822790                // False '--' '^='
     && lk != 822791                // Character '--' '^='
     && lk != 822792                // String '--' '^='
     && lk != 822793                // Real '--' '^='
     && lk != 825391                // '[' ']' '^='
     && lk != 838659                // Identifier '++' 'auto'
     && lk != 838660                // Null '++' 'auto'
     && lk != 838661                // True '++' 'auto'
     && lk != 838662                // False '++' 'auto'
     && lk != 838663                // Character '++' 'auto'
     && lk != 838664                // String '++' 'auto'
     && lk != 838665                // Real '++' 'auto'
     && lk != 839171                // Identifier '--' 'auto'
     && lk != 839172                // Null '--' 'auto'
     && lk != 839173                // True '--' 'auto'
     && lk != 839174                // False '--' 'auto'
     && lk != 839175                // Character '--' 'auto'
     && lk != 839176                // String '--' 'auto'
     && lk != 839177                // Real '--' 'auto'
     && lk != 841775                // '[' ']' 'auto'
     && lk != 855043                // Identifier '++' 'char'
     && lk != 855044                // Null '++' 'char'
     && lk != 855045                // True '++' 'char'
     && lk != 855046                // False '++' 'char'
     && lk != 855047                // Character '++' 'char'
     && lk != 855048                // String '++' 'char'
     && lk != 855049                // Real '++' 'char'
     && lk != 855555                // Identifier '--' 'char'
     && lk != 855556                // Null '--' 'char'
     && lk != 855557                // True '--' 'char'
     && lk != 855558                // False '--' 'char'
     && lk != 855559                // Character '--' 'char'
     && lk != 855560                // String '--' 'char'
     && lk != 855561                // Real '--' 'char'
     && lk != 858159                // '[' ']' 'char'
     && lk != 871427                // Identifier '++' 'const'
     && lk != 871428                // Null '++' 'const'
     && lk != 871429                // True '++' 'const'
     && lk != 871430                // False '++' 'const'
     && lk != 871431                // Character '++' 'const'
     && lk != 871432                // String '++' 'const'
     && lk != 871433                // Real '++' 'const'
     && lk != 871939                // Identifier '--' 'const'
     && lk != 871940                // Null '--' 'const'
     && lk != 871941                // True '--' 'const'
     && lk != 871942                // False '--' 'const'
     && lk != 871943                // Character '--' 'const'
     && lk != 871944                // String '--' 'const'
     && lk != 871945                // Real '--' 'const'
     && lk != 874543                // '[' ']' 'const'
     && lk != 887811                // Identifier '++' 'double'
     && lk != 887812                // Null '++' 'double'
     && lk != 887813                // True '++' 'double'
     && lk != 887814                // False '++' 'double'
     && lk != 887815                // Character '++' 'double'
     && lk != 887816                // String '++' 'double'
     && lk != 887817                // Real '++' 'double'
     && lk != 888323                // Identifier '--' 'double'
     && lk != 888324                // Null '--' 'double'
     && lk != 888325                // True '--' 'double'
     && lk != 888326                // False '--' 'double'
     && lk != 888327                // Character '--' 'double'
     && lk != 888328                // String '--' 'double'
     && lk != 888329                // Real '--' 'double'
     && lk != 890927                // '[' ']' 'double'
     && lk != 904195                // Identifier '++' 'extern'
     && lk != 904196                // Null '++' 'extern'
     && lk != 904197                // True '++' 'extern'
     && lk != 904198                // False '++' 'extern'
     && lk != 904199                // Character '++' 'extern'
     && lk != 904200                // String '++' 'extern'
     && lk != 904201                // Real '++' 'extern'
     && lk != 904707                // Identifier '--' 'extern'
     && lk != 904708                // Null '--' 'extern'
     && lk != 904709                // True '--' 'extern'
     && lk != 904710                // False '--' 'extern'
     && lk != 904711                // Character '--' 'extern'
     && lk != 904712                // String '--' 'extern'
     && lk != 904713                // Real '--' 'extern'
     && lk != 907311                // '[' ']' 'extern'
     && lk != 920579                // Identifier '++' 'float'
     && lk != 920580                // Null '++' 'float'
     && lk != 920581                // True '++' 'float'
     && lk != 920582                // False '++' 'float'
     && lk != 920583                // Character '++' 'float'
     && lk != 920584                // String '++' 'float'
     && lk != 920585                // Real '++' 'float'
     && lk != 921091                // Identifier '--' 'float'
     && lk != 921092                // Null '--' 'float'
     && lk != 921093                // True '--' 'float'
     && lk != 921094                // False '--' 'float'
     && lk != 921095                // Character '--' 'float'
     && lk != 921096                // String '--' 'float'
     && lk != 921097                // Real '--' 'float'
     && lk != 923695                // '[' ']' 'float'
     && lk != 936963                // Identifier '++' 'int'
     && lk != 936964                // Null '++' 'int'
     && lk != 936965                // True '++' 'int'
     && lk != 936966                // False '++' 'int'
     && lk != 936967                // Character '++' 'int'
     && lk != 936968                // String '++' 'int'
     && lk != 936969                // Real '++' 'int'
     && lk != 937475                // Identifier '--' 'int'
     && lk != 937476                // Null '--' 'int'
     && lk != 937477                // True '--' 'int'
     && lk != 937478                // False '--' 'int'
     && lk != 937479                // Character '--' 'int'
     && lk != 937480                // String '--' 'int'
     && lk != 937481                // Real '--' 'int'
     && lk != 940079                // '[' ']' 'int'
     && lk != 953347                // Identifier '++' 'long'
     && lk != 953348                // Null '++' 'long'
     && lk != 953349                // True '++' 'long'
     && lk != 953350                // False '++' 'long'
     && lk != 953351                // Character '++' 'long'
     && lk != 953352                // String '++' 'long'
     && lk != 953353                // Real '++' 'long'
     && lk != 953859                // Identifier '--' 'long'
     && lk != 953860                // Null '--' 'long'
     && lk != 953861                // True '--' 'long'
     && lk != 953862                // False '--' 'long'
     && lk != 953863                // Character '--' 'long'
     && lk != 953864                // String '--' 'long'
     && lk != 953865                // Real '--' 'long'
     && lk != 956463                // '[' ']' 'long'
     && lk != 969731                // Identifier '++' 'register'
     && lk != 969732                // Null '++' 'register'
     && lk != 969733                // True '++' 'register'
     && lk != 969734                // False '++' 'register'
     && lk != 969735                // Character '++' 'register'
     && lk != 969736                // String '++' 'register'
     && lk != 969737                // Real '++' 'register'
     && lk != 970243                // Identifier '--' 'register'
     && lk != 970244                // Null '--' 'register'
     && lk != 970245                // True '--' 'register'
     && lk != 970246                // False '--' 'register'
     && lk != 970247                // Character '--' 'register'
     && lk != 970248                // String '--' 'register'
     && lk != 970249                // Real '--' 'register'
     && lk != 972847                // '[' ']' 'register'
     && lk != 986115                // Identifier '++' 'short'
     && lk != 986116                // Null '++' 'short'
     && lk != 986117                // True '++' 'short'
     && lk != 986118                // False '++' 'short'
     && lk != 986119                // Character '++' 'short'
     && lk != 986120                // String '++' 'short'
     && lk != 986121                // Real '++' 'short'
     && lk != 986627                // Identifier '--' 'short'
     && lk != 986628                // Null '--' 'short'
     && lk != 986629                // True '--' 'short'
     && lk != 986630                // False '--' 'short'
     && lk != 986631                // Character '--' 'short'
     && lk != 986632                // String '--' 'short'
     && lk != 986633                // Real '--' 'short'
     && lk != 989231                // '[' ']' 'short'
     && lk != 1002499               // Identifier '++' 'signed'
     && lk != 1002500               // Null '++' 'signed'
     && lk != 1002501               // True '++' 'signed'
     && lk != 1002502               // False '++' 'signed'
     && lk != 1002503               // Character '++' 'signed'
     && lk != 1002504               // String '++' 'signed'
     && lk != 1002505               // Real '++' 'signed'
     && lk != 1003011               // Identifier '--' 'signed'
     && lk != 1003012               // Null '--' 'signed'
     && lk != 1003013               // True '--' 'signed'
     && lk != 1003014               // False '--' 'signed'
     && lk != 1003015               // Character '--' 'signed'
     && lk != 1003016               // String '--' 'signed'
     && lk != 1003017               // Real '--' 'signed'
     && lk != 1005615               // '[' ']' 'signed'
     && lk != 1018883               // Identifier '++' 'static'
     && lk != 1018884               // Null '++' 'static'
     && lk != 1018885               // True '++' 'static'
     && lk != 1018886               // False '++' 'static'
     && lk != 1018887               // Character '++' 'static'
     && lk != 1018888               // String '++' 'static'
     && lk != 1018889               // Real '++' 'static'
     && lk != 1019395               // Identifier '--' 'static'
     && lk != 1019396               // Null '--' 'static'
     && lk != 1019397               // True '--' 'static'
     && lk != 1019398               // False '--' 'static'
     && lk != 1019399               // Character '--' 'static'
     && lk != 1019400               // String '--' 'static'
     && lk != 1019401               // Real '--' 'static'
     && lk != 1021999               // '[' ']' 'static'
     && lk != 1035267               // Identifier '++' 'unsigned'
     && lk != 1035268               // Null '++' 'unsigned'
     && lk != 1035269               // True '++' 'unsigned'
     && lk != 1035270               // False '++' 'unsigned'
     && lk != 1035271               // Character '++' 'unsigned'
     && lk != 1035272               // String '++' 'unsigned'
     && lk != 1035273               // Real '++' 'unsigned'
     && lk != 1035779               // Identifier '--' 'unsigned'
     && lk != 1035780               // Null '--' 'unsigned'
     && lk != 1035781               // True '--' 'unsigned'
     && lk != 1035782               // False '--' 'unsigned'
     && lk != 1035783               // Character '--' 'unsigned'
     && lk != 1035784               // String '--' 'unsigned'
     && lk != 1035785               // Real '--' 'unsigned'
     && lk != 1038383               // '[' ']' 'unsigned'
     && lk != 1051651               // Identifier '++' 'void'
     && lk != 1051652               // Null '++' 'void'
     && lk != 1051653               // True '++' 'void'
     && lk != 1051654               // False '++' 'void'
     && lk != 1051655               // Character '++' 'void'
     && lk != 1051656               // String '++' 'void'
     && lk != 1051657               // Real '++' 'void'
     && lk != 1052163               // Identifier '--' 'void'
     && lk != 1052164               // Null '--' 'void'
     && lk != 1052165               // True '--' 'void'
     && lk != 1052166               // False '--' 'void'
     && lk != 1052167               // Character '--' 'void'
     && lk != 1052168               // String '--' 'void'
     && lk != 1052169               // Real '--' 'void'
     && lk != 1054767               // '[' ']' 'void'
     && lk != 1068035               // Identifier '++' 'volatile'
     && lk != 1068036               // Null '++' 'volatile'
     && lk != 1068037               // True '++' 'volatile'
     && lk != 1068038               // False '++' 'volatile'
     && lk != 1068039               // Character '++' 'volatile'
     && lk != 1068040               // String '++' 'volatile'
     && lk != 1068041               // Real '++' 'volatile'
     && lk != 1068547               // Identifier '--' 'volatile'
     && lk != 1068548               // Null '--' 'volatile'
     && lk != 1068549               // True '--' 'volatile'
     && lk != 1068550               // False '--' 'volatile'
     && lk != 1068551               // Character '--' 'volatile'
     && lk != 1068552               // String '--' 'volatile'
     && lk != 1068553               // Real '--' 'volatile'
     && lk != 1071151               // '[' ']' 'volatile'
     && lk != 1087535               // '[' ']' '{'
     && lk != 1100803               // Identifier '++' '|'
     && lk != 1100804               // Null '++' '|'
     && lk != 1100805               // True '++' '|'
     && lk != 1100806               // False '++' '|'
     && lk != 1100807               // Character '++' '|'
     && lk != 1100808               // String '++' '|'
     && lk != 1100809               // Real '++' '|'
     && lk != 1101315               // Identifier '--' '|'
     && lk != 1101316               // Null '--' '|'
     && lk != 1101317               // True '--' '|'
     && lk != 1101318               // False '--' '|'
     && lk != 1101319               // Character '--' '|'
     && lk != 1101320               // String '--' '|'
     && lk != 1101321               // Real '--' '|'
     && lk != 1103919               // '[' ']' '|'
     && lk != 1117187               // Identifier '++' '|='
     && lk != 1117188               // Null '++' '|='
     && lk != 1117189               // True '++' '|='
     && lk != 1117190               // False '++' '|='
     && lk != 1117191               // Character '++' '|='
     && lk != 1117192               // String '++' '|='
     && lk != 1117193               // Real '++' '|='
     && lk != 1117699               // Identifier '--' '|='
     && lk != 1117700               // Null '--' '|='
     && lk != 1117701               // True '--' '|='
     && lk != 1117702               // False '--' '|='
     && lk != 1117703               // Character '--' '|='
     && lk != 1117704               // String '--' '|='
     && lk != 1117705               // Real '--' '|='
     && lk != 1120303               // '[' ']' '|='
     && lk != 1133571               // Identifier '++' '||'
     && lk != 1133572               // Null '++' '||'
     && lk != 1133573               // True '++' '||'
     && lk != 1133574               // False '++' '||'
     && lk != 1133575               // Character '++' '||'
     && lk != 1133576               // String '++' '||'
     && lk != 1133577               // Real '++' '||'
     && lk != 1134083               // Identifier '--' '||'
     && lk != 1134084               // Null '--' '||'
     && lk != 1134085               // True '--' '||'
     && lk != 1134086               // False '--' '||'
     && lk != 1134087               // Character '--' '||'
     && lk != 1134088               // String '--' '||'
     && lk != 1134089               // Real '--' '||'
     && lk != 1136687               // '[' ']' '||'
     && lk != 1149955               // Identifier '++' '}'
     && lk != 1149956               // Null '++' '}'
     && lk != 1149957               // True '++' '}'
     && lk != 1149958               // False '++' '}'
     && lk != 1149959               // Character '++' '}'
     && lk != 1149960               // String '++' '}'
     && lk != 1149961               // Real '++' '}'
     && lk != 1150467               // Identifier '--' '}'
     && lk != 1150468               // Null '--' '}'
     && lk != 1150469               // True '--' '}'
     && lk != 1150470               // False '--' '}'
     && lk != 1150471               // Character '--' '}'
     && lk != 1150472               // String '--' '}'
     && lk != 1150473               // Real '--' '}'
     && lk != 1153071               // '[' ']' '}'
     && lk != 1166339               // Identifier '++' '~'
     && lk != 1166340               // Null '++' '~'
     && lk != 1166341               // True '++' '~'
     && lk != 1166342               // False '++' '~'
     && lk != 1166343               // Character '++' '~'
     && lk != 1166344               // String '++' '~'
     && lk != 1166345               // Real '++' '~'
     && lk != 1166851               // Identifier '--' '~'
     && lk != 1166852               // Null '--' '~'
     && lk != 1166853               // True '--' '~'
     && lk != 1166854               // False '--' '~'
     && lk != 1166855               // Character '--' '~'
     && lk != 1166856               // String '--' '~'
     && lk != 1166857               // Real '--' '~'
     && lk != 1169455)              // '[' ']' '~'
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
    case 71:                        // '~'
      consumeT(71);                 // '~'
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
    case 19459:                     // Identifier '++' END
    case 19460:                     // Null '++' END
    case 19461:                     // True '++' END
    case 19462:                     // False '++' END
    case 19463:                     // Character '++' END
    case 19464:                     // String '++' END
    case 19465:                     // Real '++' END
    case 166915:                    // Identifier '++' Comment
    case 166916:                    // Null '++' Comment
    case 166917:                    // True '++' Comment
    case 166918:                    // False '++' Comment
    case 166919:                    // Character '++' Comment
    case 166920:                    // String '++' Comment
    case 166921:                    // Real '++' Comment
    case 199683:                    // Identifier '++' '!'
    case 199684:                    // Null '++' '!'
    case 199685:                    // True '++' '!'
    case 199686:                    // False '++' '!'
    case 199687:                    // Character '++' '!'
    case 199688:                    // String '++' '!'
    case 199689:                    // Real '++' '!'
    case 216067:                    // Identifier '++' '!='
    case 216068:                    // Null '++' '!='
    case 216069:                    // True '++' '!='
    case 216070:                    // False '++' '!='
    case 216071:                    // Character '++' '!='
    case 216072:                    // String '++' '!='
    case 216073:                    // Real '++' '!='
    case 232451:                    // Identifier '++' '%'
    case 232452:                    // Null '++' '%'
    case 232453:                    // True '++' '%'
    case 232454:                    // False '++' '%'
    case 232455:                    // Character '++' '%'
    case 232456:                    // String '++' '%'
    case 232457:                    // Real '++' '%'
    case 248835:                    // Identifier '++' '%='
    case 248836:                    // Null '++' '%='
    case 248837:                    // True '++' '%='
    case 248838:                    // False '++' '%='
    case 248839:                    // Character '++' '%='
    case 248840:                    // String '++' '%='
    case 248841:                    // Real '++' '%='
    case 265219:                    // Identifier '++' '&'
    case 265220:                    // Null '++' '&'
    case 265221:                    // True '++' '&'
    case 265222:                    // False '++' '&'
    case 265223:                    // Character '++' '&'
    case 265224:                    // String '++' '&'
    case 265225:                    // Real '++' '&'
    case 281603:                    // Identifier '++' '&&'
    case 281604:                    // Null '++' '&&'
    case 281605:                    // True '++' '&&'
    case 281606:                    // False '++' '&&'
    case 281607:                    // Character '++' '&&'
    case 281608:                    // String '++' '&&'
    case 281609:                    // Real '++' '&&'
    case 297987:                    // Identifier '++' '&='
    case 297988:                    // Null '++' '&='
    case 297989:                    // True '++' '&='
    case 297990:                    // False '++' '&='
    case 297991:                    // Character '++' '&='
    case 297992:                    // String '++' '&='
    case 297993:                    // Real '++' '&='
    case 330755:                    // Identifier '++' ')'
    case 330756:                    // Null '++' ')'
    case 330757:                    // True '++' ')'
    case 330758:                    // False '++' ')'
    case 330759:                    // Character '++' ')'
    case 330760:                    // String '++' ')'
    case 330761:                    // Real '++' ')'
    case 347139:                    // Identifier '++' '*'
    case 347140:                    // Null '++' '*'
    case 347141:                    // True '++' '*'
    case 347142:                    // False '++' '*'
    case 347143:                    // Character '++' '*'
    case 347144:                    // String '++' '*'
    case 347145:                    // Real '++' '*'
    case 363523:                    // Identifier '++' '*='
    case 363524:                    // Null '++' '*='
    case 363525:                    // True '++' '*='
    case 363526:                    // False '++' '*='
    case 363527:                    // Character '++' '*='
    case 363528:                    // String '++' '*='
    case 363529:                    // Real '++' '*='
    case 379907:                    // Identifier '++' '+'
    case 379908:                    // Null '++' '+'
    case 379909:                    // True '++' '+'
    case 379910:                    // False '++' '+'
    case 379911:                    // Character '++' '+'
    case 379912:                    // String '++' '+'
    case 379913:                    // Real '++' '+'
    case 396291:                    // Identifier '++' '++'
    case 396292:                    // Null '++' '++'
    case 396293:                    // True '++' '++'
    case 396294:                    // False '++' '++'
    case 396295:                    // Character '++' '++'
    case 396296:                    // String '++' '++'
    case 396297:                    // Real '++' '++'
    case 412675:                    // Identifier '++' '+='
    case 412676:                    // Null '++' '+='
    case 412677:                    // True '++' '+='
    case 412678:                    // False '++' '+='
    case 412679:                    // Character '++' '+='
    case 412680:                    // String '++' '+='
    case 412681:                    // Real '++' '+='
    case 429059:                    // Identifier '++' ','
    case 429060:                    // Null '++' ','
    case 429061:                    // True '++' ','
    case 429062:                    // False '++' ','
    case 429063:                    // Character '++' ','
    case 429064:                    // String '++' ','
    case 429065:                    // Real '++' ','
    case 445443:                    // Identifier '++' '-'
    case 445444:                    // Null '++' '-'
    case 445445:                    // True '++' '-'
    case 445446:                    // False '++' '-'
    case 445447:                    // Character '++' '-'
    case 445448:                    // String '++' '-'
    case 445449:                    // Real '++' '-'
    case 461827:                    // Identifier '++' '--'
    case 461828:                    // Null '++' '--'
    case 461829:                    // True '++' '--'
    case 461830:                    // False '++' '--'
    case 461831:                    // Character '++' '--'
    case 461832:                    // String '++' '--'
    case 461833:                    // Real '++' '--'
    case 478211:                    // Identifier '++' '-='
    case 478212:                    // Null '++' '-='
    case 478213:                    // True '++' '-='
    case 478214:                    // False '++' '-='
    case 478215:                    // Character '++' '-='
    case 478216:                    // String '++' '-='
    case 478217:                    // Real '++' '-='
    case 527363:                    // Identifier '++' '/'
    case 527364:                    // Null '++' '/'
    case 527365:                    // True '++' '/'
    case 527366:                    // False '++' '/'
    case 527367:                    // Character '++' '/'
    case 527368:                    // String '++' '/'
    case 527369:                    // Real '++' '/'
    case 543747:                    // Identifier '++' '/='
    case 543748:                    // Null '++' '/='
    case 543749:                    // True '++' '/='
    case 543750:                    // False '++' '/='
    case 543751:                    // Character '++' '/='
    case 543752:                    // String '++' '/='
    case 543753:                    // Real '++' '/='
    case 560131:                    // Identifier '++' ':'
    case 560132:                    // Null '++' ':'
    case 560133:                    // True '++' ':'
    case 560134:                    // False '++' ':'
    case 560135:                    // Character '++' ':'
    case 560136:                    // String '++' ':'
    case 560137:                    // Real '++' ':'
    case 576515:                    // Identifier '++' ';'
    case 576516:                    // Null '++' ';'
    case 576517:                    // True '++' ';'
    case 576518:                    // False '++' ';'
    case 576519:                    // Character '++' ';'
    case 576520:                    // String '++' ';'
    case 576521:                    // Real '++' ';'
    case 592899:                    // Identifier '++' '<'
    case 592900:                    // Null '++' '<'
    case 592901:                    // True '++' '<'
    case 592902:                    // False '++' '<'
    case 592903:                    // Character '++' '<'
    case 592904:                    // String '++' '<'
    case 592905:                    // Real '++' '<'
    case 609283:                    // Identifier '++' '<<'
    case 609284:                    // Null '++' '<<'
    case 609285:                    // True '++' '<<'
    case 609286:                    // False '++' '<<'
    case 609287:                    // Character '++' '<<'
    case 609288:                    // String '++' '<<'
    case 609289:                    // Real '++' '<<'
    case 625667:                    // Identifier '++' '<<='
    case 625668:                    // Null '++' '<<='
    case 625669:                    // True '++' '<<='
    case 625670:                    // False '++' '<<='
    case 625671:                    // Character '++' '<<='
    case 625672:                    // String '++' '<<='
    case 625673:                    // Real '++' '<<='
    case 642051:                    // Identifier '++' '<='
    case 642052:                    // Null '++' '<='
    case 642053:                    // True '++' '<='
    case 642054:                    // False '++' '<='
    case 642055:                    // Character '++' '<='
    case 642056:                    // String '++' '<='
    case 642057:                    // Real '++' '<='
    case 658435:                    // Identifier '++' '='
    case 658436:                    // Null '++' '='
    case 658437:                    // True '++' '='
    case 658438:                    // False '++' '='
    case 658439:                    // Character '++' '='
    case 658440:                    // String '++' '='
    case 658441:                    // Real '++' '='
    case 674819:                    // Identifier '++' '=='
    case 674820:                    // Null '++' '=='
    case 674821:                    // True '++' '=='
    case 674822:                    // False '++' '=='
    case 674823:                    // Character '++' '=='
    case 674824:                    // String '++' '=='
    case 674825:                    // Real '++' '=='
    case 691203:                    // Identifier '++' '>'
    case 691204:                    // Null '++' '>'
    case 691205:                    // True '++' '>'
    case 691206:                    // False '++' '>'
    case 691207:                    // Character '++' '>'
    case 691208:                    // String '++' '>'
    case 691209:                    // Real '++' '>'
    case 707587:                    // Identifier '++' '>='
    case 707588:                    // Null '++' '>='
    case 707589:                    // True '++' '>='
    case 707590:                    // False '++' '>='
    case 707591:                    // Character '++' '>='
    case 707592:                    // String '++' '>='
    case 707593:                    // Real '++' '>='
    case 723971:                    // Identifier '++' '>>'
    case 723972:                    // Null '++' '>>'
    case 723973:                    // True '++' '>>'
    case 723974:                    // False '++' '>>'
    case 723975:                    // Character '++' '>>'
    case 723976:                    // String '++' '>>'
    case 723977:                    // Real '++' '>>'
    case 740355:                    // Identifier '++' '>>='
    case 740356:                    // Null '++' '>>='
    case 740357:                    // True '++' '>>='
    case 740358:                    // False '++' '>>='
    case 740359:                    // Character '++' '>>='
    case 740360:                    // String '++' '>>='
    case 740361:                    // Real '++' '>>='
    case 756739:                    // Identifier '++' '?'
    case 756740:                    // Null '++' '?'
    case 756741:                    // True '++' '?'
    case 756742:                    // False '++' '?'
    case 756743:                    // Character '++' '?'
    case 756744:                    // String '++' '?'
    case 756745:                    // Real '++' '?'
    case 789507:                    // Identifier '++' ']'
    case 789508:                    // Null '++' ']'
    case 789509:                    // True '++' ']'
    case 789510:                    // False '++' ']'
    case 789511:                    // Character '++' ']'
    case 789512:                    // String '++' ']'
    case 789513:                    // Real '++' ']'
    case 805891:                    // Identifier '++' '^'
    case 805892:                    // Null '++' '^'
    case 805893:                    // True '++' '^'
    case 805894:                    // False '++' '^'
    case 805895:                    // Character '++' '^'
    case 805896:                    // String '++' '^'
    case 805897:                    // Real '++' '^'
    case 822275:                    // Identifier '++' '^='
    case 822276:                    // Null '++' '^='
    case 822277:                    // True '++' '^='
    case 822278:                    // False '++' '^='
    case 822279:                    // Character '++' '^='
    case 822280:                    // String '++' '^='
    case 822281:                    // Real '++' '^='
    case 838659:                    // Identifier '++' 'auto'
    case 838660:                    // Null '++' 'auto'
    case 838661:                    // True '++' 'auto'
    case 838662:                    // False '++' 'auto'
    case 838663:                    // Character '++' 'auto'
    case 838664:                    // String '++' 'auto'
    case 838665:                    // Real '++' 'auto'
    case 855043:                    // Identifier '++' 'char'
    case 855044:                    // Null '++' 'char'
    case 855045:                    // True '++' 'char'
    case 855046:                    // False '++' 'char'
    case 855047:                    // Character '++' 'char'
    case 855048:                    // String '++' 'char'
    case 855049:                    // Real '++' 'char'
    case 871427:                    // Identifier '++' 'const'
    case 871428:                    // Null '++' 'const'
    case 871429:                    // True '++' 'const'
    case 871430:                    // False '++' 'const'
    case 871431:                    // Character '++' 'const'
    case 871432:                    // String '++' 'const'
    case 871433:                    // Real '++' 'const'
    case 887811:                    // Identifier '++' 'double'
    case 887812:                    // Null '++' 'double'
    case 887813:                    // True '++' 'double'
    case 887814:                    // False '++' 'double'
    case 887815:                    // Character '++' 'double'
    case 887816:                    // String '++' 'double'
    case 887817:                    // Real '++' 'double'
    case 904195:                    // Identifier '++' 'extern'
    case 904196:                    // Null '++' 'extern'
    case 904197:                    // True '++' 'extern'
    case 904198:                    // False '++' 'extern'
    case 904199:                    // Character '++' 'extern'
    case 904200:                    // String '++' 'extern'
    case 904201:                    // Real '++' 'extern'
    case 920579:                    // Identifier '++' 'float'
    case 920580:                    // Null '++' 'float'
    case 920581:                    // True '++' 'float'
    case 920582:                    // False '++' 'float'
    case 920583:                    // Character '++' 'float'
    case 920584:                    // String '++' 'float'
    case 920585:                    // Real '++' 'float'
    case 936963:                    // Identifier '++' 'int'
    case 936964:                    // Null '++' 'int'
    case 936965:                    // True '++' 'int'
    case 936966:                    // False '++' 'int'
    case 936967:                    // Character '++' 'int'
    case 936968:                    // String '++' 'int'
    case 936969:                    // Real '++' 'int'
    case 953347:                    // Identifier '++' 'long'
    case 953348:                    // Null '++' 'long'
    case 953349:                    // True '++' 'long'
    case 953350:                    // False '++' 'long'
    case 953351:                    // Character '++' 'long'
    case 953352:                    // String '++' 'long'
    case 953353:                    // Real '++' 'long'
    case 969731:                    // Identifier '++' 'register'
    case 969732:                    // Null '++' 'register'
    case 969733:                    // True '++' 'register'
    case 969734:                    // False '++' 'register'
    case 969735:                    // Character '++' 'register'
    case 969736:                    // String '++' 'register'
    case 969737:                    // Real '++' 'register'
    case 986115:                    // Identifier '++' 'short'
    case 986116:                    // Null '++' 'short'
    case 986117:                    // True '++' 'short'
    case 986118:                    // False '++' 'short'
    case 986119:                    // Character '++' 'short'
    case 986120:                    // String '++' 'short'
    case 986121:                    // Real '++' 'short'
    case 1002499:                   // Identifier '++' 'signed'
    case 1002500:                   // Null '++' 'signed'
    case 1002501:                   // True '++' 'signed'
    case 1002502:                   // False '++' 'signed'
    case 1002503:                   // Character '++' 'signed'
    case 1002504:                   // String '++' 'signed'
    case 1002505:                   // Real '++' 'signed'
    case 1018883:                   // Identifier '++' 'static'
    case 1018884:                   // Null '++' 'static'
    case 1018885:                   // True '++' 'static'
    case 1018886:                   // False '++' 'static'
    case 1018887:                   // Character '++' 'static'
    case 1018888:                   // String '++' 'static'
    case 1018889:                   // Real '++' 'static'
    case 1035267:                   // Identifier '++' 'unsigned'
    case 1035268:                   // Null '++' 'unsigned'
    case 1035269:                   // True '++' 'unsigned'
    case 1035270:                   // False '++' 'unsigned'
    case 1035271:                   // Character '++' 'unsigned'
    case 1035272:                   // String '++' 'unsigned'
    case 1035273:                   // Real '++' 'unsigned'
    case 1051651:                   // Identifier '++' 'void'
    case 1051652:                   // Null '++' 'void'
    case 1051653:                   // True '++' 'void'
    case 1051654:                   // False '++' 'void'
    case 1051655:                   // Character '++' 'void'
    case 1051656:                   // String '++' 'void'
    case 1051657:                   // Real '++' 'void'
    case 1068035:                   // Identifier '++' 'volatile'
    case 1068036:                   // Null '++' 'volatile'
    case 1068037:                   // True '++' 'volatile'
    case 1068038:                   // False '++' 'volatile'
    case 1068039:                   // Character '++' 'volatile'
    case 1068040:                   // String '++' 'volatile'
    case 1068041:                   // Real '++' 'volatile'
    case 1100803:                   // Identifier '++' '|'
    case 1100804:                   // Null '++' '|'
    case 1100805:                   // True '++' '|'
    case 1100806:                   // False '++' '|'
    case 1100807:                   // Character '++' '|'
    case 1100808:                   // String '++' '|'
    case 1100809:                   // Real '++' '|'
    case 1117187:                   // Identifier '++' '|='
    case 1117188:                   // Null '++' '|='
    case 1117189:                   // True '++' '|='
    case 1117190:                   // False '++' '|='
    case 1117191:                   // Character '++' '|='
    case 1117192:                   // String '++' '|='
    case 1117193:                   // Real '++' '|='
    case 1133571:                   // Identifier '++' '||'
    case 1133572:                   // Null '++' '||'
    case 1133573:                   // True '++' '||'
    case 1133574:                   // False '++' '||'
    case 1133575:                   // Character '++' '||'
    case 1133576:                   // String '++' '||'
    case 1133577:                   // Real '++' '||'
    case 1149955:                   // Identifier '++' '}'
    case 1149956:                   // Null '++' '}'
    case 1149957:                   // True '++' '}'
    case 1149958:                   // False '++' '}'
    case 1149959:                   // Character '++' '}'
    case 1149960:                   // String '++' '}'
    case 1149961:                   // Real '++' '}'
    case 1166339:                   // Identifier '++' '~'
    case 1166340:                   // Null '++' '~'
    case 1166341:                   // True '++' '~'
    case 1166342:                   // False '++' '~'
    case 1166343:                   // Character '++' '~'
    case 1166344:                   // String '++' '~'
    case 1166345:                   // Real '++' '~'
      try_Primary();
      lookahead1W(2);               // WhiteSpace^token | '++'
      consumeT(24);                 // '++'
      break;
    case -6:
    case 19971:                     // Identifier '--' END
    case 19972:                     // Null '--' END
    case 19973:                     // True '--' END
    case 19974:                     // False '--' END
    case 19975:                     // Character '--' END
    case 19976:                     // String '--' END
    case 19977:                     // Real '--' END
    case 167427:                    // Identifier '--' Comment
    case 167428:                    // Null '--' Comment
    case 167429:                    // True '--' Comment
    case 167430:                    // False '--' Comment
    case 167431:                    // Character '--' Comment
    case 167432:                    // String '--' Comment
    case 167433:                    // Real '--' Comment
    case 200195:                    // Identifier '--' '!'
    case 200196:                    // Null '--' '!'
    case 200197:                    // True '--' '!'
    case 200198:                    // False '--' '!'
    case 200199:                    // Character '--' '!'
    case 200200:                    // String '--' '!'
    case 200201:                    // Real '--' '!'
    case 216579:                    // Identifier '--' '!='
    case 216580:                    // Null '--' '!='
    case 216581:                    // True '--' '!='
    case 216582:                    // False '--' '!='
    case 216583:                    // Character '--' '!='
    case 216584:                    // String '--' '!='
    case 216585:                    // Real '--' '!='
    case 232963:                    // Identifier '--' '%'
    case 232964:                    // Null '--' '%'
    case 232965:                    // True '--' '%'
    case 232966:                    // False '--' '%'
    case 232967:                    // Character '--' '%'
    case 232968:                    // String '--' '%'
    case 232969:                    // Real '--' '%'
    case 249347:                    // Identifier '--' '%='
    case 249348:                    // Null '--' '%='
    case 249349:                    // True '--' '%='
    case 249350:                    // False '--' '%='
    case 249351:                    // Character '--' '%='
    case 249352:                    // String '--' '%='
    case 249353:                    // Real '--' '%='
    case 265731:                    // Identifier '--' '&'
    case 265732:                    // Null '--' '&'
    case 265733:                    // True '--' '&'
    case 265734:                    // False '--' '&'
    case 265735:                    // Character '--' '&'
    case 265736:                    // String '--' '&'
    case 265737:                    // Real '--' '&'
    case 282115:                    // Identifier '--' '&&'
    case 282116:                    // Null '--' '&&'
    case 282117:                    // True '--' '&&'
    case 282118:                    // False '--' '&&'
    case 282119:                    // Character '--' '&&'
    case 282120:                    // String '--' '&&'
    case 282121:                    // Real '--' '&&'
    case 298499:                    // Identifier '--' '&='
    case 298500:                    // Null '--' '&='
    case 298501:                    // True '--' '&='
    case 298502:                    // False '--' '&='
    case 298503:                    // Character '--' '&='
    case 298504:                    // String '--' '&='
    case 298505:                    // Real '--' '&='
    case 331267:                    // Identifier '--' ')'
    case 331268:                    // Null '--' ')'
    case 331269:                    // True '--' ')'
    case 331270:                    // False '--' ')'
    case 331271:                    // Character '--' ')'
    case 331272:                    // String '--' ')'
    case 331273:                    // Real '--' ')'
    case 347651:                    // Identifier '--' '*'
    case 347652:                    // Null '--' '*'
    case 347653:                    // True '--' '*'
    case 347654:                    // False '--' '*'
    case 347655:                    // Character '--' '*'
    case 347656:                    // String '--' '*'
    case 347657:                    // Real '--' '*'
    case 364035:                    // Identifier '--' '*='
    case 364036:                    // Null '--' '*='
    case 364037:                    // True '--' '*='
    case 364038:                    // False '--' '*='
    case 364039:                    // Character '--' '*='
    case 364040:                    // String '--' '*='
    case 364041:                    // Real '--' '*='
    case 380419:                    // Identifier '--' '+'
    case 380420:                    // Null '--' '+'
    case 380421:                    // True '--' '+'
    case 380422:                    // False '--' '+'
    case 380423:                    // Character '--' '+'
    case 380424:                    // String '--' '+'
    case 380425:                    // Real '--' '+'
    case 396803:                    // Identifier '--' '++'
    case 396804:                    // Null '--' '++'
    case 396805:                    // True '--' '++'
    case 396806:                    // False '--' '++'
    case 396807:                    // Character '--' '++'
    case 396808:                    // String '--' '++'
    case 396809:                    // Real '--' '++'
    case 413187:                    // Identifier '--' '+='
    case 413188:                    // Null '--' '+='
    case 413189:                    // True '--' '+='
    case 413190:                    // False '--' '+='
    case 413191:                    // Character '--' '+='
    case 413192:                    // String '--' '+='
    case 413193:                    // Real '--' '+='
    case 429571:                    // Identifier '--' ','
    case 429572:                    // Null '--' ','
    case 429573:                    // True '--' ','
    case 429574:                    // False '--' ','
    case 429575:                    // Character '--' ','
    case 429576:                    // String '--' ','
    case 429577:                    // Real '--' ','
    case 445955:                    // Identifier '--' '-'
    case 445956:                    // Null '--' '-'
    case 445957:                    // True '--' '-'
    case 445958:                    // False '--' '-'
    case 445959:                    // Character '--' '-'
    case 445960:                    // String '--' '-'
    case 445961:                    // Real '--' '-'
    case 462339:                    // Identifier '--' '--'
    case 462340:                    // Null '--' '--'
    case 462341:                    // True '--' '--'
    case 462342:                    // False '--' '--'
    case 462343:                    // Character '--' '--'
    case 462344:                    // String '--' '--'
    case 462345:                    // Real '--' '--'
    case 478723:                    // Identifier '--' '-='
    case 478724:                    // Null '--' '-='
    case 478725:                    // True '--' '-='
    case 478726:                    // False '--' '-='
    case 478727:                    // Character '--' '-='
    case 478728:                    // String '--' '-='
    case 478729:                    // Real '--' '-='
    case 527875:                    // Identifier '--' '/'
    case 527876:                    // Null '--' '/'
    case 527877:                    // True '--' '/'
    case 527878:                    // False '--' '/'
    case 527879:                    // Character '--' '/'
    case 527880:                    // String '--' '/'
    case 527881:                    // Real '--' '/'
    case 544259:                    // Identifier '--' '/='
    case 544260:                    // Null '--' '/='
    case 544261:                    // True '--' '/='
    case 544262:                    // False '--' '/='
    case 544263:                    // Character '--' '/='
    case 544264:                    // String '--' '/='
    case 544265:                    // Real '--' '/='
    case 560643:                    // Identifier '--' ':'
    case 560644:                    // Null '--' ':'
    case 560645:                    // True '--' ':'
    case 560646:                    // False '--' ':'
    case 560647:                    // Character '--' ':'
    case 560648:                    // String '--' ':'
    case 560649:                    // Real '--' ':'
    case 577027:                    // Identifier '--' ';'
    case 577028:                    // Null '--' ';'
    case 577029:                    // True '--' ';'
    case 577030:                    // False '--' ';'
    case 577031:                    // Character '--' ';'
    case 577032:                    // String '--' ';'
    case 577033:                    // Real '--' ';'
    case 593411:                    // Identifier '--' '<'
    case 593412:                    // Null '--' '<'
    case 593413:                    // True '--' '<'
    case 593414:                    // False '--' '<'
    case 593415:                    // Character '--' '<'
    case 593416:                    // String '--' '<'
    case 593417:                    // Real '--' '<'
    case 609795:                    // Identifier '--' '<<'
    case 609796:                    // Null '--' '<<'
    case 609797:                    // True '--' '<<'
    case 609798:                    // False '--' '<<'
    case 609799:                    // Character '--' '<<'
    case 609800:                    // String '--' '<<'
    case 609801:                    // Real '--' '<<'
    case 626179:                    // Identifier '--' '<<='
    case 626180:                    // Null '--' '<<='
    case 626181:                    // True '--' '<<='
    case 626182:                    // False '--' '<<='
    case 626183:                    // Character '--' '<<='
    case 626184:                    // String '--' '<<='
    case 626185:                    // Real '--' '<<='
    case 642563:                    // Identifier '--' '<='
    case 642564:                    // Null '--' '<='
    case 642565:                    // True '--' '<='
    case 642566:                    // False '--' '<='
    case 642567:                    // Character '--' '<='
    case 642568:                    // String '--' '<='
    case 642569:                    // Real '--' '<='
    case 658947:                    // Identifier '--' '='
    case 658948:                    // Null '--' '='
    case 658949:                    // True '--' '='
    case 658950:                    // False '--' '='
    case 658951:                    // Character '--' '='
    case 658952:                    // String '--' '='
    case 658953:                    // Real '--' '='
    case 675331:                    // Identifier '--' '=='
    case 675332:                    // Null '--' '=='
    case 675333:                    // True '--' '=='
    case 675334:                    // False '--' '=='
    case 675335:                    // Character '--' '=='
    case 675336:                    // String '--' '=='
    case 675337:                    // Real '--' '=='
    case 691715:                    // Identifier '--' '>'
    case 691716:                    // Null '--' '>'
    case 691717:                    // True '--' '>'
    case 691718:                    // False '--' '>'
    case 691719:                    // Character '--' '>'
    case 691720:                    // String '--' '>'
    case 691721:                    // Real '--' '>'
    case 708099:                    // Identifier '--' '>='
    case 708100:                    // Null '--' '>='
    case 708101:                    // True '--' '>='
    case 708102:                    // False '--' '>='
    case 708103:                    // Character '--' '>='
    case 708104:                    // String '--' '>='
    case 708105:                    // Real '--' '>='
    case 724483:                    // Identifier '--' '>>'
    case 724484:                    // Null '--' '>>'
    case 724485:                    // True '--' '>>'
    case 724486:                    // False '--' '>>'
    case 724487:                    // Character '--' '>>'
    case 724488:                    // String '--' '>>'
    case 724489:                    // Real '--' '>>'
    case 740867:                    // Identifier '--' '>>='
    case 740868:                    // Null '--' '>>='
    case 740869:                    // True '--' '>>='
    case 740870:                    // False '--' '>>='
    case 740871:                    // Character '--' '>>='
    case 740872:                    // String '--' '>>='
    case 740873:                    // Real '--' '>>='
    case 757251:                    // Identifier '--' '?'
    case 757252:                    // Null '--' '?'
    case 757253:                    // True '--' '?'
    case 757254:                    // False '--' '?'
    case 757255:                    // Character '--' '?'
    case 757256:                    // String '--' '?'
    case 757257:                    // Real '--' '?'
    case 790019:                    // Identifier '--' ']'
    case 790020:                    // Null '--' ']'
    case 790021:                    // True '--' ']'
    case 790022:                    // False '--' ']'
    case 790023:                    // Character '--' ']'
    case 790024:                    // String '--' ']'
    case 790025:                    // Real '--' ']'
    case 806403:                    // Identifier '--' '^'
    case 806404:                    // Null '--' '^'
    case 806405:                    // True '--' '^'
    case 806406:                    // False '--' '^'
    case 806407:                    // Character '--' '^'
    case 806408:                    // String '--' '^'
    case 806409:                    // Real '--' '^'
    case 822787:                    // Identifier '--' '^='
    case 822788:                    // Null '--' '^='
    case 822789:                    // True '--' '^='
    case 822790:                    // False '--' '^='
    case 822791:                    // Character '--' '^='
    case 822792:                    // String '--' '^='
    case 822793:                    // Real '--' '^='
    case 839171:                    // Identifier '--' 'auto'
    case 839172:                    // Null '--' 'auto'
    case 839173:                    // True '--' 'auto'
    case 839174:                    // False '--' 'auto'
    case 839175:                    // Character '--' 'auto'
    case 839176:                    // String '--' 'auto'
    case 839177:                    // Real '--' 'auto'
    case 855555:                    // Identifier '--' 'char'
    case 855556:                    // Null '--' 'char'
    case 855557:                    // True '--' 'char'
    case 855558:                    // False '--' 'char'
    case 855559:                    // Character '--' 'char'
    case 855560:                    // String '--' 'char'
    case 855561:                    // Real '--' 'char'
    case 871939:                    // Identifier '--' 'const'
    case 871940:                    // Null '--' 'const'
    case 871941:                    // True '--' 'const'
    case 871942:                    // False '--' 'const'
    case 871943:                    // Character '--' 'const'
    case 871944:                    // String '--' 'const'
    case 871945:                    // Real '--' 'const'
    case 888323:                    // Identifier '--' 'double'
    case 888324:                    // Null '--' 'double'
    case 888325:                    // True '--' 'double'
    case 888326:                    // False '--' 'double'
    case 888327:                    // Character '--' 'double'
    case 888328:                    // String '--' 'double'
    case 888329:                    // Real '--' 'double'
    case 904707:                    // Identifier '--' 'extern'
    case 904708:                    // Null '--' 'extern'
    case 904709:                    // True '--' 'extern'
    case 904710:                    // False '--' 'extern'
    case 904711:                    // Character '--' 'extern'
    case 904712:                    // String '--' 'extern'
    case 904713:                    // Real '--' 'extern'
    case 921091:                    // Identifier '--' 'float'
    case 921092:                    // Null '--' 'float'
    case 921093:                    // True '--' 'float'
    case 921094:                    // False '--' 'float'
    case 921095:                    // Character '--' 'float'
    case 921096:                    // String '--' 'float'
    case 921097:                    // Real '--' 'float'
    case 937475:                    // Identifier '--' 'int'
    case 937476:                    // Null '--' 'int'
    case 937477:                    // True '--' 'int'
    case 937478:                    // False '--' 'int'
    case 937479:                    // Character '--' 'int'
    case 937480:                    // String '--' 'int'
    case 937481:                    // Real '--' 'int'
    case 953859:                    // Identifier '--' 'long'
    case 953860:                    // Null '--' 'long'
    case 953861:                    // True '--' 'long'
    case 953862:                    // False '--' 'long'
    case 953863:                    // Character '--' 'long'
    case 953864:                    // String '--' 'long'
    case 953865:                    // Real '--' 'long'
    case 970243:                    // Identifier '--' 'register'
    case 970244:                    // Null '--' 'register'
    case 970245:                    // True '--' 'register'
    case 970246:                    // False '--' 'register'
    case 970247:                    // Character '--' 'register'
    case 970248:                    // String '--' 'register'
    case 970249:                    // Real '--' 'register'
    case 986627:                    // Identifier '--' 'short'
    case 986628:                    // Null '--' 'short'
    case 986629:                    // True '--' 'short'
    case 986630:                    // False '--' 'short'
    case 986631:                    // Character '--' 'short'
    case 986632:                    // String '--' 'short'
    case 986633:                    // Real '--' 'short'
    case 1003011:                   // Identifier '--' 'signed'
    case 1003012:                   // Null '--' 'signed'
    case 1003013:                   // True '--' 'signed'
    case 1003014:                   // False '--' 'signed'
    case 1003015:                   // Character '--' 'signed'
    case 1003016:                   // String '--' 'signed'
    case 1003017:                   // Real '--' 'signed'
    case 1019395:                   // Identifier '--' 'static'
    case 1019396:                   // Null '--' 'static'
    case 1019397:                   // True '--' 'static'
    case 1019398:                   // False '--' 'static'
    case 1019399:                   // Character '--' 'static'
    case 1019400:                   // String '--' 'static'
    case 1019401:                   // Real '--' 'static'
    case 1035779:                   // Identifier '--' 'unsigned'
    case 1035780:                   // Null '--' 'unsigned'
    case 1035781:                   // True '--' 'unsigned'
    case 1035782:                   // False '--' 'unsigned'
    case 1035783:                   // Character '--' 'unsigned'
    case 1035784:                   // String '--' 'unsigned'
    case 1035785:                   // Real '--' 'unsigned'
    case 1052163:                   // Identifier '--' 'void'
    case 1052164:                   // Null '--' 'void'
    case 1052165:                   // True '--' 'void'
    case 1052166:                   // False '--' 'void'
    case 1052167:                   // Character '--' 'void'
    case 1052168:                   // String '--' 'void'
    case 1052169:                   // Real '--' 'void'
    case 1068547:                   // Identifier '--' 'volatile'
    case 1068548:                   // Null '--' 'volatile'
    case 1068549:                   // True '--' 'volatile'
    case 1068550:                   // False '--' 'volatile'
    case 1068551:                   // Character '--' 'volatile'
    case 1068552:                   // String '--' 'volatile'
    case 1068553:                   // Real '--' 'volatile'
    case 1101315:                   // Identifier '--' '|'
    case 1101316:                   // Null '--' '|'
    case 1101317:                   // True '--' '|'
    case 1101318:                   // False '--' '|'
    case 1101319:                   // Character '--' '|'
    case 1101320:                   // String '--' '|'
    case 1101321:                   // Real '--' '|'
    case 1117699:                   // Identifier '--' '|='
    case 1117700:                   // Null '--' '|='
    case 1117701:                   // True '--' '|='
    case 1117702:                   // False '--' '|='
    case 1117703:                   // Character '--' '|='
    case 1117704:                   // String '--' '|='
    case 1117705:                   // Real '--' '|='
    case 1134083:                   // Identifier '--' '||'
    case 1134084:                   // Null '--' '||'
    case 1134085:                   // True '--' '||'
    case 1134086:                   // False '--' '||'
    case 1134087:                   // Character '--' '||'
    case 1134088:                   // String '--' '||'
    case 1134089:                   // Real '--' '||'
    case 1150467:                   // Identifier '--' '}'
    case 1150468:                   // Null '--' '}'
    case 1150469:                   // True '--' '}'
    case 1150470:                   // False '--' '}'
    case 1150471:                   // Character '--' '}'
    case 1150472:                   // String '--' '}'
    case 1150473:                   // Real '--' '}'
    case 1166851:                   // Identifier '--' '~'
    case 1166852:                   // Null '--' '~'
    case 1166853:                   // True '--' '~'
    case 1166854:                   // False '--' '~'
    case 1166855:                   // Character '--' '~'
    case 1166856:                   // String '--' '~'
    case 1166857:                   // Real '--' '~'
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
    for (;;)
    {
      lookahead1W(10);              // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
      switch (l1)
      {
      case 58:                      // 'long'
      case 60:                      // 'short'
        lookahead2W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        switch (lk)
        {
        case 6714:                  // 'long' 'char'
        case 6970:                  // 'long' 'double'
        case 7226:                  // 'long' 'float'
        case 7354:                  // 'long' 'int'
        case 7482:                  // 'long' 'long'
        case 7738:                  // 'long' 'short'
        case 8250:                  // 'long' 'void'
        case 6716:                  // 'short' 'char'
        case 6972:                  // 'short' 'double'
        case 7228:                  // 'short' 'float'
        case 7356:                  // 'short' 'int'
        case 7484:                  // 'short' 'long'
        case 7740:                  // 'short' 'short'
        case 8252:                  // 'short' 'void'
          lookahead3W(11);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 6586:                  // 'long' 'auto'
        case 6842:                  // 'long' 'const'
        case 7098:                  // 'long' 'extern'
        case 7610:                  // 'long' 'register'
        case 7866:                  // 'long' 'signed'
        case 7994:                  // 'long' 'static'
        case 8122:                  // 'long' 'unsigned'
        case 8378:                  // 'long' 'volatile'
        case 6588:                  // 'short' 'auto'
        case 6844:                  // 'short' 'const'
        case 7100:                  // 'short' 'extern'
        case 7612:                  // 'short' 'register'
        case 7868:                  // 'short' 'signed'
        case 7996:                  // 'short' 'static'
        case 8124:                  // 'short' 'unsigned'
        case 8380:                  // 'short' 'volatile'
          lookahead3W(10);          // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk != 51                  // 'auto'
       && lk != 52                  // 'char'
       && lk != 53                  // 'const'
       && lk != 54                  // 'double'
       && lk != 55                  // 'extern'
       && lk != 56                  // 'float'
       && lk != 57                  // 'int'
       && lk != 59                  // 'register'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 64                  // 'void'
       && lk != 65                  // 'volatile'
       && lk != 442                 // 'long' Identifier
       && lk != 444                 // 'short' Identifier
       && lk != 570                 // 'long' Null
       && lk != 572                 // 'short' Null
       && lk != 698                 // 'long' True
       && lk != 700                 // 'short' True
       && lk != 826                 // 'long' False
       && lk != 828                 // 'short' False
       && lk != 954                 // 'long' Character
       && lk != 956                 // 'short' Character
       && lk != 1082                // 'long' String
       && lk != 1084                // 'short' String
       && lk != 1210                // 'long' Real
       && lk != 1212                // 'short' Real
       && lk != 1338                // 'long' Comment
       && lk != 1340                // 'short' Comment
       && lk != 1594                // 'long' '!'
       && lk != 1596                // 'short' '!'
       && lk != 2490                // 'long' '('
       && lk != 2492                // 'short' '('
       && lk != 3130                // 'long' '++'
       && lk != 3132                // 'short' '++'
       && lk != 3642                // 'long' '--'
       && lk != 3644                // 'short' '--'
       && lk != 4538                // 'long' ';'
       && lk != 4540                // 'short' ';'
       && lk != 6074                // 'long' '['
       && lk != 6076                // 'short' '['
       && lk != 8506                // 'long' '{'
       && lk != 8508                // 'short' '{'
       && lk != 9146                // 'long' '~'
       && lk != 9148)               // 'short' '~'
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
            try_Qualifier();
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
      if (lk != -1
       && lk != 51                  // 'auto'
       && lk != 53                  // 'const'
       && lk != 55                  // 'extern'
       && lk != 59                  // 'register'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 65)                 // 'volatile'
      {
        break;
      }
      whitespace();
      parse_Qualifier();
    }
    whitespace();
    parse_Type();
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    whitespace();
    parse_Expression();
    eventHandler.endNonterminal("VariableDeclaration", e0);
  }

  function try_VariableDeclaration()
  {
    for (;;)
    {
      lookahead1W(10);              // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
      switch (l1)
      {
      case 58:                      // 'long'
      case 60:                      // 'short'
        lookahead2W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        switch (lk)
        {
        case 6714:                  // 'long' 'char'
        case 6970:                  // 'long' 'double'
        case 7226:                  // 'long' 'float'
        case 7354:                  // 'long' 'int'
        case 7482:                  // 'long' 'long'
        case 7738:                  // 'long' 'short'
        case 8250:                  // 'long' 'void'
        case 6716:                  // 'short' 'char'
        case 6972:                  // 'short' 'double'
        case 7228:                  // 'short' 'float'
        case 7356:                  // 'short' 'int'
        case 7484:                  // 'short' 'long'
        case 7740:                  // 'short' 'short'
        case 8252:                  // 'short' 'void'
          lookahead3W(11);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          break;
        case 6586:                  // 'long' 'auto'
        case 6842:                  // 'long' 'const'
        case 7098:                  // 'long' 'extern'
        case 7610:                  // 'long' 'register'
        case 7866:                  // 'long' 'signed'
        case 7994:                  // 'long' 'static'
        case 8122:                  // 'long' 'unsigned'
        case 8378:                  // 'long' 'volatile'
        case 6588:                  // 'short' 'auto'
        case 6844:                  // 'short' 'const'
        case 7100:                  // 'short' 'extern'
        case 7612:                  // 'short' 'register'
        case 7868:                  // 'short' 'signed'
        case 7996:                  // 'short' 'static'
        case 8124:                  // 'short' 'unsigned'
        case 8380:                  // 'short' 'volatile'
          lookahead3W(10);          // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk != 51                  // 'auto'
       && lk != 52                  // 'char'
       && lk != 53                  // 'const'
       && lk != 54                  // 'double'
       && lk != 55                  // 'extern'
       && lk != 56                  // 'float'
       && lk != 57                  // 'int'
       && lk != 59                  // 'register'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 64                  // 'void'
       && lk != 65                  // 'volatile'
       && lk != 442                 // 'long' Identifier
       && lk != 444                 // 'short' Identifier
       && lk != 570                 // 'long' Null
       && lk != 572                 // 'short' Null
       && lk != 698                 // 'long' True
       && lk != 700                 // 'short' True
       && lk != 826                 // 'long' False
       && lk != 828                 // 'short' False
       && lk != 954                 // 'long' Character
       && lk != 956                 // 'short' Character
       && lk != 1082                // 'long' String
       && lk != 1084                // 'short' String
       && lk != 1210                // 'long' Real
       && lk != 1212                // 'short' Real
       && lk != 1338                // 'long' Comment
       && lk != 1340                // 'short' Comment
       && lk != 1594                // 'long' '!'
       && lk != 1596                // 'short' '!'
       && lk != 2490                // 'long' '('
       && lk != 2492                // 'short' '('
       && lk != 3130                // 'long' '++'
       && lk != 3132                // 'short' '++'
       && lk != 3642                // 'long' '--'
       && lk != 3644                // 'short' '--'
       && lk != 4538                // 'long' ';'
       && lk != 4540                // 'short' ';'
       && lk != 6074                // 'long' '['
       && lk != 6076                // 'short' '['
       && lk != 8506                // 'long' '{'
       && lk != 8508                // 'short' '{'
       && lk != 9146                // 'long' '~'
       && lk != 9148)               // 'short' '~'
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
            try_Qualifier();
            memoize(3, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            memoize(3, e0A, -2);
            break;
          }
        }
      }
      if (lk != -1
       && lk != 51                  // 'auto'
       && lk != 53                  // 'const'
       && lk != 55                  // 'extern'
       && lk != 59                  // 'register'
       && lk != 61                  // 'signed'
       && lk != 62                  // 'static'
       && lk != 63                  // 'unsigned'
       && lk != 65)                 // 'volatile'
      {
        break;
      }
      try_Qualifier();
    }
    try_Type();
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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

  function parse_Qualifier()
  {
    eventHandler.startNonterminal("Qualifier", e0);
    switch (l1)
    {
    case 51:                        // 'auto'
      consume(51);                  // 'auto'
      break;
    case 53:                        // 'const'
      consume(53);                  // 'const'
      break;
    case 55:                        // 'extern'
      consume(55);                  // 'extern'
      break;
    case 58:                        // 'long'
      consume(58);                  // 'long'
      break;
    case 59:                        // 'register'
      consume(59);                  // 'register'
      break;
    case 60:                        // 'short'
      consume(60);                  // 'short'
      break;
    case 61:                        // 'signed'
      consume(61);                  // 'signed'
      break;
    case 62:                        // 'static'
      consume(62);                  // 'static'
      break;
    case 63:                        // 'unsigned'
      consume(63);                  // 'unsigned'
      break;
    default:
      consume(65);                  // 'volatile'
    }
    eventHandler.endNonterminal("Qualifier", e0);
  }

  function try_Qualifier()
  {
    switch (l1)
    {
    case 51:                        // 'auto'
      consumeT(51);                 // 'auto'
      break;
    case 53:                        // 'const'
      consumeT(53);                 // 'const'
      break;
    case 55:                        // 'extern'
      consumeT(55);                 // 'extern'
      break;
    case 58:                        // 'long'
      consumeT(58);                 // 'long'
      break;
    case 59:                        // 'register'
      consumeT(59);                 // 'register'
      break;
    case 60:                        // 'short'
      consumeT(60);                 // 'short'
      break;
    case 61:                        // 'signed'
      consumeT(61);                 // 'signed'
      break;
    case 62:                        // 'static'
      consumeT(62);                 // 'static'
      break;
    case 63:                        // 'unsigned'
      consumeT(63);                 // 'unsigned'
      break;
    default:
      consumeT(65);                 // 'volatile'
    }
  }

  function parse_Type()
  {
    eventHandler.startNonterminal("Type", e0);
    switch (l1)
    {
    case 52:                        // 'char'
      consume(52);                  // 'char'
      break;
    case 54:                        // 'double'
      consume(54);                  // 'double'
      break;
    case 56:                        // 'float'
      consume(56);                  // 'float'
      break;
    case 57:                        // 'int'
      consume(57);                  // 'int'
      break;
    case 58:                        // 'long'
      consume(58);                  // 'long'
      break;
    case 60:                        // 'short'
      consume(60);                  // 'short'
      break;
    default:
      consume(64);                  // 'void'
    }
    eventHandler.endNonterminal("Type", e0);
  }

  function try_Type()
  {
    switch (l1)
    {
    case 52:                        // 'char'
      consumeT(52);                 // 'char'
      break;
    case 54:                        // 'double'
      consumeT(54);                 // 'double'
      break;
    case 56:                        // 'float'
      consumeT(56);                 // 'float'
      break;
    case 57:                        // 'int'
      consumeT(57);                 // 'int'
      break;
    case 58:                        // 'long'
      consumeT(58);                 // 'long'
      break;
    case 60:                        // 'short'
      consumeT(60);                 // 'short'
      break;
    default:
      consumeT(64);                 // 'void'
    }
  }

  function parse_Arguments()
  {
    eventHandler.startNonterminal("Arguments", e0);
    parse_Expression();
    for (;;)
    {
      lookahead1W(18);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | ',' | '--' | ';' | '[' | ']' |
                                    // 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' |
                                    // 'register' | 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' |
                                    // '{' | '~'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
      lookahead1W(18);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | ',' | '--' | ';' | '[' | ']' |
                                    // 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' |
                                    // 'register' | 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' |
                                    // '{' | '~'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      try_Expression();
    }
  }

  function parse_Member()
  {
    eventHandler.startNonterminal("Member", e0);
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(26);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 2435:                    // Identifier '('
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 3843:                    // Identifier '->'
      case 3971:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 51587                 // Identifier '(' Identifier
     || lk == 52995                 // Identifier '->' Identifier
     || lk == 53123                 // Identifier '.' Identifier
     || lk == 67971                 // Identifier '(' Null
     || lk == 84355                 // Identifier '(' True
     || lk == 100739                // Identifier '(' False
     || lk == 117123                // Identifier '(' Character
     || lk == 133507                // Identifier '(' String
     || lk == 149891                // Identifier '(' Real
     || lk == 166275                // Identifier '(' Comment
     || lk == 199043                // Identifier '(' '!'
     || lk == 313731                // Identifier '(' '('
     || lk == 395651                // Identifier '(' '++'
     || lk == 461187                // Identifier '(' '--'
     || lk == 575875                // Identifier '(' ';'
     || lk == 772483                // Identifier '(' '['
     || lk == 838019                // Identifier '(' 'auto'
     || lk == 854403                // Identifier '(' 'char'
     || lk == 870787                // Identifier '(' 'const'
     || lk == 887171                // Identifier '(' 'double'
     || lk == 903555                // Identifier '(' 'extern'
     || lk == 919939                // Identifier '(' 'float'
     || lk == 936323                // Identifier '(' 'int'
     || lk == 952707                // Identifier '(' 'long'
     || lk == 969091                // Identifier '(' 'register'
     || lk == 985475                // Identifier '(' 'short'
     || lk == 1001859               // Identifier '(' 'signed'
     || lk == 1018243               // Identifier '(' 'static'
     || lk == 1034627               // Identifier '(' 'unsigned'
     || lk == 1051011               // Identifier '(' 'void'
     || lk == 1067395               // Identifier '(' 'volatile'
     || lk == 1083779               // Identifier '(' '{'
     || lk == 1165699)              // Identifier '(' '~'
    {
      lk = memoized(4, e0);
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
            lookahead1W(13);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
        memoize(4, e0, lk);
      }
    }
    switch (lk)
    {
    case -1:
    case 330115:                    // Identifier '(' ')'
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
        lookahead1W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
        lookahead1W(26);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
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
        lookahead1W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        switch (l1)
        {
        case 47:                    // '['
          lookahead2W(14);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          switch (lk)
          {
          case 431:                 // '[' Identifier
            lookahead3W(24);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
            break;
          case 1327:                // '[' Comment
            lookahead3W(7);         // WhiteSpace^token | ',' | ';' | ']'
            break;
          case 4527:                // '[' ';'
            lookahead3W(16);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
            break;
          case 6063:                // '[' '['
            lookahead3W(14);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
            break;
          case 1583:                // '[' '!'
          case 3119:                // '[' '++'
          case 3631:                // '[' '--'
          case 9135:                // '[' '~'
            lookahead3W(8);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
            break;
          case 559:                 // '[' Null
          case 687:                 // '[' True
          case 815:                 // '[' False
          case 943:                 // '[' Character
          case 1071:                // '[' String
          case 1199:                // '[' Real
            lookahead3W(21);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
            break;
          case 6575:                // '[' 'auto'
          case 6831:                // '[' 'const'
          case 7087:                // '[' 'extern'
          case 7599:                // '[' 'register'
          case 7855:                // '[' 'signed'
          case 7983:                // '[' 'static'
          case 8111:                // '[' 'unsigned'
          case 8367:                // '[' 'volatile'
            lookahead3W(10);        // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
            break;
          case 2479:                // '[' '('
          case 6703:                // '[' 'char'
          case 6959:                // '[' 'double'
          case 7215:                // '[' 'float'
          case 7343:                // '[' 'int'
          case 7471:                // '[' 'long'
          case 7727:                // '[' 'short'
          case 8239:                // '[' 'void'
          case 8495:                // '[' '{'
            lookahead3W(11);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
         && lk != 51                // 'auto'
         && lk != 52                // 'char'
         && lk != 53                // 'const'
         && lk != 54                // 'double'
         && lk != 55                // 'extern'
         && lk != 56                // 'float'
         && lk != 57                // 'int'
         && lk != 58                // 'long'
         && lk != 59                // 'register'
         && lk != 60                // 'short'
         && lk != 61                // 'signed'
         && lk != 62                // 'static'
         && lk != 63                // 'unsigned'
         && lk != 64                // 'void'
         && lk != 65                // 'volatile'
         && lk != 66                // '{'
         && lk != 67                // '|'
         && lk != 68                // '|='
         && lk != 69                // '||'
         && lk != 70                // '}'
         && lk != 71                // '~'
         && lk != 6191              // '[' ']'
         && lk != 53679             // '[' ';' Identifier
         && lk != 70063             // '[' ';' Null
         && lk != 86447             // '[' ';' True
         && lk != 102831            // '[' ';' False
         && lk != 119215            // '[' ';' Character
         && lk != 135599            // '[' ';' String
         && lk != 151983            // '[' ';' Real
         && lk != 168367            // '[' ';' Comment
         && lk != 201135            // '[' ';' '!'
         && lk != 315823            // '[' ';' '('
         && lk != 397743            // '[' ';' '++'
         && lk != 463279            // '[' ';' '--'
         && lk != 573871            // '[' Identifier ';'
         && lk != 573999            // '[' Null ';'
         && lk != 574127            // '[' True ';'
         && lk != 574255            // '[' False ';'
         && lk != 574383            // '[' Character ';'
         && lk != 574511            // '[' String ';'
         && lk != 574639            // '[' Real ';'
         && lk != 574767            // '[' Comment ';'
         && lk != 577967            // '[' ';' ';'
         && lk != 774575            // '[' ';' '['
         && lk != 840111            // '[' ';' 'auto'
         && lk != 856495            // '[' ';' 'char'
         && lk != 872879            // '[' ';' 'const'
         && lk != 889263            // '[' ';' 'double'
         && lk != 905647            // '[' ';' 'extern'
         && lk != 922031            // '[' ';' 'float'
         && lk != 938415            // '[' ';' 'int'
         && lk != 954799            // '[' ';' 'long'
         && lk != 971183            // '[' ';' 'register'
         && lk != 987567            // '[' ';' 'short'
         && lk != 1003951           // '[' ';' 'signed'
         && lk != 1020335           // '[' ';' 'static'
         && lk != 1036719           // '[' ';' 'unsigned'
         && lk != 1053103           // '[' ';' 'void'
         && lk != 1069487           // '[' ';' 'volatile'
         && lk != 1085871           // '[' ';' '{'
         && lk != 1167791)          // '[' ';' '~'
        {
          lk = memoized(5, e0);
          if (lk == 0)
          {
            var b0B = b0; var e0B = e0; var l1B = l1;
            var b1B = b1; var e1B = e1; var l2B = l2;
            var b2B = b2; var e2B = e2; var l3B = l3;
            var b3B = b3; var e3B = e3;
            try
            {
              consumeT(47);         // '['
              lookahead1W(11);      // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
            memoize(5, e0, lk);
          }
        }
        if (lk != -1)
        {
          break;
        }
        consume(47);                // '['
        lookahead1W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
      lookahead2W(26);              // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
      switch (lk)
      {
      case 2435:                    // Identifier '('
        lookahead3W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      case 3843:                    // Identifier '->'
      case 3971:                    // Identifier '.'
        lookahead3W(0);             // Identifier | WhiteSpace^token
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 51587                 // Identifier '(' Identifier
     || lk == 52995                 // Identifier '->' Identifier
     || lk == 53123                 // Identifier '.' Identifier
     || lk == 67971                 // Identifier '(' Null
     || lk == 84355                 // Identifier '(' True
     || lk == 100739                // Identifier '(' False
     || lk == 117123                // Identifier '(' Character
     || lk == 133507                // Identifier '(' String
     || lk == 149891                // Identifier '(' Real
     || lk == 166275                // Identifier '(' Comment
     || lk == 199043                // Identifier '(' '!'
     || lk == 313731                // Identifier '(' '('
     || lk == 395651                // Identifier '(' '++'
     || lk == 461187                // Identifier '(' '--'
     || lk == 575875                // Identifier '(' ';'
     || lk == 772483                // Identifier '(' '['
     || lk == 838019                // Identifier '(' 'auto'
     || lk == 854403                // Identifier '(' 'char'
     || lk == 870787                // Identifier '(' 'const'
     || lk == 887171                // Identifier '(' 'double'
     || lk == 903555                // Identifier '(' 'extern'
     || lk == 919939                // Identifier '(' 'float'
     || lk == 936323                // Identifier '(' 'int'
     || lk == 952707                // Identifier '(' 'long'
     || lk == 969091                // Identifier '(' 'register'
     || lk == 985475                // Identifier '(' 'short'
     || lk == 1001859               // Identifier '(' 'signed'
     || lk == 1018243               // Identifier '(' 'static'
     || lk == 1034627               // Identifier '(' 'unsigned'
     || lk == 1051011               // Identifier '(' 'void'
     || lk == 1067395               // Identifier '(' 'volatile'
     || lk == 1083779               // Identifier '(' '{'
     || lk == 1165699)              // Identifier '(' '~'
    {
      lk = memoized(4, e0);
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
            lookahead1W(13);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
            if (l1 == 20)           // ')'
            {
              break;
            }
            try_Arguments();
          }
          consumeT(20);             // ')'
          memoize(4, e0A, -1);
          lk = -3;
        }
        catch (p1A)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(4, e0A, -2);
        }
      }
    }
    switch (lk)
    {
    case -1:
    case 330115:                    // Identifier '(' ')'
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
        lookahead1W(13);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | ')' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
        lookahead1W(26);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' |
                                    // '/=' | ':' | ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>=' | '?' | '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' |
                                    // 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' |
                                    // 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
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
        lookahead1W(25);            // END | Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'auto' | 'char' | 'const' | 'double' | 'extern' |
                                    // 'float' | 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' |
                                    // 'unsigned' | 'void' | 'volatile' | '{' | '|' | '|=' | '||' | '}' | '~'
        switch (l1)
        {
        case 47:                    // '['
          lookahead2W(14);          // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
          switch (lk)
          {
          case 431:                 // '[' Identifier
            lookahead3W(24);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // ']' | '^' | '^=' | '|' | '|=' | '||'
            break;
          case 1327:                // '[' Comment
            lookahead3W(7);         // WhiteSpace^token | ',' | ';' | ']'
            break;
          case 4527:                // '[' ';'
            lookahead3W(16);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
            break;
          case 6063:                // '[' '['
            lookahead3W(14);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
            break;
          case 1583:                // '[' '!'
          case 3119:                // '[' '++'
          case 3631:                // '[' '--'
          case 9135:                // '[' '~'
            lookahead3W(8);         // Identifier | Null | True | False | Character | String | Real | WhiteSpace^token |
                                    // '(' | '[' | '{'
            break;
          case 559:                 // '[' Null
          case 687:                 // '[' True
          case 815:                 // '[' False
          case 943:                 // '[' Character
          case 1071:                // '[' String
          case 1199:                // '[' Real
            lookahead3W(21);        // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ';' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | ']' | '^' | '^=' | '|' |
                                    // '|=' | '||'
            break;
          case 6575:                // '[' 'auto'
          case 6831:                // '[' 'const'
          case 7087:                // '[' 'extern'
          case 7599:                // '[' 'register'
          case 7855:                // '[' 'signed'
          case 7983:                // '[' 'static'
          case 8111:                // '[' 'unsigned'
          case 8367:                // '[' 'volatile'
            lookahead3W(10);        // WhiteSpace^token | 'auto' | 'char' | 'const' | 'double' | 'extern' | 'float' |
                                    // 'int' | 'long' | 'register' | 'short' | 'signed' | 'static' | 'unsigned' |
                                    // 'void' | 'volatile'
            break;
          case 2479:                // '[' '('
          case 6703:                // '[' 'char'
          case 6959:                // '[' 'double'
          case 7215:                // '[' 'float'
          case 7343:                // '[' 'int'
          case 7471:                // '[' 'long'
          case 7727:                // '[' 'short'
          case 8239:                // '[' 'void'
          case 8495:                // '[' '{'
            lookahead3W(11);        // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
         && lk != 51                // 'auto'
         && lk != 52                // 'char'
         && lk != 53                // 'const'
         && lk != 54                // 'double'
         && lk != 55                // 'extern'
         && lk != 56                // 'float'
         && lk != 57                // 'int'
         && lk != 58                // 'long'
         && lk != 59                // 'register'
         && lk != 60                // 'short'
         && lk != 61                // 'signed'
         && lk != 62                // 'static'
         && lk != 63                // 'unsigned'
         && lk != 64                // 'void'
         && lk != 65                // 'volatile'
         && lk != 66                // '{'
         && lk != 67                // '|'
         && lk != 68                // '|='
         && lk != 69                // '||'
         && lk != 70                // '}'
         && lk != 71                // '~'
         && lk != 6191              // '[' ']'
         && lk != 53679             // '[' ';' Identifier
         && lk != 70063             // '[' ';' Null
         && lk != 86447             // '[' ';' True
         && lk != 102831            // '[' ';' False
         && lk != 119215            // '[' ';' Character
         && lk != 135599            // '[' ';' String
         && lk != 151983            // '[' ';' Real
         && lk != 168367            // '[' ';' Comment
         && lk != 201135            // '[' ';' '!'
         && lk != 315823            // '[' ';' '('
         && lk != 397743            // '[' ';' '++'
         && lk != 463279            // '[' ';' '--'
         && lk != 573871            // '[' Identifier ';'
         && lk != 573999            // '[' Null ';'
         && lk != 574127            // '[' True ';'
         && lk != 574255            // '[' False ';'
         && lk != 574383            // '[' Character ';'
         && lk != 574511            // '[' String ';'
         && lk != 574639            // '[' Real ';'
         && lk != 574767            // '[' Comment ';'
         && lk != 577967            // '[' ';' ';'
         && lk != 774575            // '[' ';' '['
         && lk != 840111            // '[' ';' 'auto'
         && lk != 856495            // '[' ';' 'char'
         && lk != 872879            // '[' ';' 'const'
         && lk != 889263            // '[' ';' 'double'
         && lk != 905647            // '[' ';' 'extern'
         && lk != 922031            // '[' ';' 'float'
         && lk != 938415            // '[' ';' 'int'
         && lk != 954799            // '[' ';' 'long'
         && lk != 971183            // '[' ';' 'register'
         && lk != 987567            // '[' ';' 'short'
         && lk != 1003951           // '[' ';' 'signed'
         && lk != 1020335           // '[' ';' 'static'
         && lk != 1036719           // '[' ';' 'unsigned'
         && lk != 1053103           // '[' ';' 'void'
         && lk != 1069487           // '[' ';' 'volatile'
         && lk != 1085871           // '[' ';' '{'
         && lk != 1167791)          // '[' ';' '~'
        {
          lk = memoized(5, e0);
          if (lk == 0)
          {
            var b0B = b0; var e0B = e0; var l1B = l1;
            var b1B = b1; var e1B = e1; var l2B = l2;
            var b2B = b2; var e2B = e2; var l3B = l3;
            var b3B = b3; var e3B = e3;
            try
            {
              consumeT(47);         // '['
              lookahead1W(11);      // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
              try_Arguments();
              consumeT(48);         // ']'
              memoize(5, e0B, -1);
              continue;
            }
            catch (p1B)
            {
              b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
              b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
              b2 = b2B; e2 = e2B; l3 = l3B; if (l3 == 0) {end = e2B;} else {
              b3 = b3B; e3 = e3B; end = e3B; }}}
              memoize(5, e0B, -2);
              break;
            }
          }
        }
        if (lk != -1)
        {
          break;
        }
        consumeT(47);               // '['
        lookahead1W(11);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        try_Arguments();
        consumeT(48);               // ']'
      }
    }
  }

  function parse_Array()
  {
    eventHandler.startNonterminal("Array", e0);
    consume(66);                    // '{'
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      whitespace();
      parse_Element();
    }
    consume(70);                    // '}'
    eventHandler.endNonterminal("Array", e0);
  }

  function try_Array()
  {
    consumeT(66);                   // '{'
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    try_Element();
    for (;;)
    {
      lookahead1W(5);               // WhiteSpace^token | ',' | '}'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      try_Element();
    }
    consumeT(70);                   // '}'
  }

  function parse_Matrix()
  {
    eventHandler.startNonterminal("Matrix", e0);
    consume(47);                    // '['
    lookahead1W(14);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    switch (l1)
    {
    case 35:                        // ';'
      lookahead2W(16);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 4515:                    // ';' ';'
        lookahead3W(16);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 577955)               // ';' ';' ';'
    {
      lk = memoized(6, e0);
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
        memoize(6, e0, lk);
      }
    }
    if (lk != -2
     && lk != 48                    // ']'
     && lk != 419                   // ';' Identifier
     && lk != 547                   // ';' Null
     && lk != 675                   // ';' True
     && lk != 803                   // ';' False
     && lk != 931                   // ';' Character
     && lk != 1059                  // ';' String
     && lk != 1187                  // ';' Real
     && lk != 1315                  // ';' Comment
     && lk != 1571                  // ';' '!'
     && lk != 2467                  // ';' '('
     && lk != 3107                  // ';' '++'
     && lk != 3619                  // ';' '--'
     && lk != 6051                  // ';' '['
     && lk != 6563                  // ';' 'auto'
     && lk != 6691                  // ';' 'char'
     && lk != 6819                  // ';' 'const'
     && lk != 6947                  // ';' 'double'
     && lk != 7075                  // ';' 'extern'
     && lk != 7203                  // ';' 'float'
     && lk != 7331                  // ';' 'int'
     && lk != 7459                  // ';' 'long'
     && lk != 7587                  // ';' 'register'
     && lk != 7715                  // ';' 'short'
     && lk != 7843                  // ';' 'signed'
     && lk != 7971                  // ';' 'static'
     && lk != 8099                  // ';' 'unsigned'
     && lk != 8227                  // ';' 'void'
     && lk != 8355                  // ';' 'volatile'
     && lk != 8483                  // ';' '{'
     && lk != 9123                  // ';' '~'
     && lk != 430499                // ';' ';' ','
     && lk != 790947)               // ';' ';' ']'
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
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      whitespace();
      parse_Row();
    }
    consume(48);                    // ']'
    eventHandler.endNonterminal("Matrix", e0);
  }

  function try_Matrix()
  {
    consumeT(47);                   // '['
    lookahead1W(14);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | ']' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    switch (l1)
    {
    case 35:                        // ';'
      lookahead2W(16);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
      switch (lk)
      {
      case 4515:                    // ';' ';'
        lookahead3W(16);            // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | ',' | '--' | ';' | '[' | ']' | 'auto' |
                                    // 'char' | 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' |
                                    // 'short' | 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
        break;
      }
      break;
    default:
      lk = l1;
    }
    if (lk == 577955)               // ';' ';' ';'
    {
      lk = memoized(6, e0);
      if (lk == 0)
      {
        var b0A = b0; var e0A = e0; var l1A = l1;
        var b1A = b1; var e1A = e1; var l2A = l2;
        var b2A = b2; var e2A = e2; var l3A = l3;
        var b3A = b3; var e3A = e3;
        try
        {
          try_Row();
          memoize(6, e0A, -1);
        }
        catch (p1A)
        {
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(6, e0A, -2);
        }
        lk = -2;
      }
    }
    if (lk != -2
     && lk != 48                    // ']'
     && lk != 419                   // ';' Identifier
     && lk != 547                   // ';' Null
     && lk != 675                   // ';' True
     && lk != 803                   // ';' False
     && lk != 931                   // ';' Character
     && lk != 1059                  // ';' String
     && lk != 1187                  // ';' Real
     && lk != 1315                  // ';' Comment
     && lk != 1571                  // ';' '!'
     && lk != 2467                  // ';' '('
     && lk != 3107                  // ';' '++'
     && lk != 3619                  // ';' '--'
     && lk != 6051                  // ';' '['
     && lk != 6563                  // ';' 'auto'
     && lk != 6691                  // ';' 'char'
     && lk != 6819                  // ';' 'const'
     && lk != 6947                  // ';' 'double'
     && lk != 7075                  // ';' 'extern'
     && lk != 7203                  // ';' 'float'
     && lk != 7331                  // ';' 'int'
     && lk != 7459                  // ';' 'long'
     && lk != 7587                  // ';' 'register'
     && lk != 7715                  // ';' 'short'
     && lk != 7843                  // ';' 'signed'
     && lk != 7971                  // ';' 'static'
     && lk != 8099                  // ';' 'unsigned'
     && lk != 8227                  // ';' 'void'
     && lk != 8355                  // ';' 'volatile'
     && lk != 8483                  // ';' '{'
     && lk != 9123                  // ';' '~'
     && lk != 430499                // ';' ';' ','
     && lk != 790947)               // ';' ';' ']'
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
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
      lookahead2W(23);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
      break;
    case 8:                         // String
      lookahead2W(20);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 4355                  // Identifier ':'
     || lk == 4360)                 // String ':'
    {
      whitespace();
      parse_Key();
      lookahead1W(4);               // WhiteSpace^token | ':'
      consume(34);                  // ':'
    }
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    whitespace();
    parse_Expression();
    eventHandler.endNonterminal("Element", e0);
  }

  function try_Element()
  {
    switch (l1)
    {
    case 3:                         // Identifier
      lookahead2W(23);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '->' | '.' | '/' | '/=' | ':' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '[' |
                                    // '^' | '^=' | '|' | '|=' | '||' | '}'
      break;
    case 8:                         // String
      lookahead2W(20);              // WhiteSpace^token | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '*' | '*=' | '+' |
                                    // '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | '<' | '<<' | '<<=' |
                                    // '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '?' | '^' | '^=' | '|' | '|=' |
                                    // '||' | '}'
      break;
    default:
      lk = l1;
    }
    if (lk == 4355                  // Identifier ':'
     || lk == 4360)                 // String ':'
    {
      try_Key();
      lookahead1W(4);               // WhiteSpace^token | ':'
      consumeT(34);                 // ':'
    }
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
      lookahead1W(11);              // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
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
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    whitespace();
    parse_Expression();
    lookahead1W(1);                 // WhiteSpace^token | ')'
    consume(20);                    // ')'
    eventHandler.endNonterminal("ParenthesizedExpression", e0);
  }

  function try_ParenthesizedExpression()
  {
    consumeT(19);                   // '('
    lookahead1W(11);                // Identifier | Null | True | False | Character | String | Real | Comment |
                                    // WhiteSpace^token | '!' | '(' | '++' | '--' | ';' | '[' | 'auto' | 'char' |
                                    // 'const' | 'double' | 'extern' | 'float' | 'int' | 'long' | 'register' | 'short' |
                                    // 'signed' | 'static' | 'unsigned' | 'void' | 'volatile' | '{' | '~'
    try_Expression();
    lookahead1W(1);                 // WhiteSpace^token | ')'
    consumeT(20);                   // ')'
  }

  function parse_Value()
  {
    eventHandler.startNonterminal("Value", e0);
    switch (l1)
    {
    case 66:                        // '{'
      parse_Array();
      break;
    case 7:                         // Character
      consume(7);                   // Character
      break;
    case 6:                         // False
      consume(6);                   // False
      break;
    case 47:                        // '['
      parse_Matrix();
      break;
    case 4:                         // Null
      consume(4);                   // Null
      break;
    case 9:                         // Real
      consume(9);                   // Real
      break;
    case 8:                         // String
      consume(8);                   // String
      break;
    default:
      consume(5);                   // True
    }
    eventHandler.endNonterminal("Value", e0);
  }

  function try_Value()
  {
    switch (l1)
    {
    case 66:                        // '{'
      try_Array();
      break;
    case 7:                         // Character
      consumeT(7);                  // Character
      break;
    case 6:                         // False
      consumeT(6);                  // False
      break;
    case 47:                        // '['
      try_Matrix();
      break;
    case 4:                         // Null
      consumeT(4);                  // Null
      break;
    case 9:                         // Real
      consumeT(9);                  // Real
      break;
    case 8:                         // String
      consumeT(8);                  // String
      break;
    default:
      consumeT(5);                  // True
    }
  }

  function consume(t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler.terminal(Operators.TOKEN[l1], b1, e1);
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
    lk = (l2 << 7) | l1;
  }

  function lookahead3W(tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = matchW(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 14;
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
    var result = Operators.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 511; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = Operators.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 5;
        charclass = Operators.MAP1[(c0 & 31) + Operators.MAP1[(c1 & 31) + Operators.MAP1[c1 >> 5]]];
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
          if (Operators.MAP2[m] > c0) hi = m - 1;
          else if (Operators.MAP2[2 + m] < c0) lo = m + 1;
          else {charclass = Operators.MAP2[4 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 9) + code - 1;
      code = Operators.TRANSITION[(i0 & 15) + Operators.TRANSITION[i0 >> 4]];

      if (code > 511)
      {
        result = code;
        code &= 511;
        end = current;
      }
    }

    result >>= 9;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    return (result & 127) - 1;
  }

}

Operators.XmlSerializer = function(log, indent)
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

Operators.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : Operators.INITIAL[tokenSetId] & 511;
  for (var i = 0; i < 72; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 313 + s - 1;
    var i1 = i0 >> 2;
    var f = Operators.EXPECTED[(i0 & 3) + Operators.EXPECTED[(i1 & 3) + Operators.EXPECTED[i1 >> 2]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(Operators.TOKEN[j]);
      }
    }
  }
  return set;
};

Operators.TopDownTreeBuilder = function()
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
    var nonterminal = new Operators.Nonterminal(name, begin, begin, []);
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
    addChild(new Operators.Terminal(name, begin, end));
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

Operators.Terminal = function(name, begin, end)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.terminal(name, begin, end);
  };
};

Operators.Nonterminal = function(name, begin, end, children)
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

Operators.MAP0 =
[
  /*   0 */ 66, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 5, 6,
  /*  36 */ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 21, 22, 21, 21, 23, 23, 24, 25, 26, 27, 28, 29,
  /*  64 */ 7, 30, 30, 31, 30, 32, 30, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33,
  /*  91 */ 34, 35, 36, 37, 33, 7, 38, 39, 40, 41, 42, 43, 44, 45, 46, 33, 47, 48, 49, 50, 51, 52, 33, 53, 54, 55, 56,
  /* 118 */ 57, 58, 59, 60, 61, 62, 63, 64, 65, 7
];

Operators.MAP1 =
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

Operators.MAP2 =
[
  /* 0 */ 57344, 65536, 65533, 1114111, 7, 7
];

Operators.INITIAL =
[
  /*  0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1036, 13, 14, 1039, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1049, 1050
];

Operators.TRANSITION =
[
  /*    0 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*   18 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5098, 5096,
  /*   36 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097,
  /*   54 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2144, 2149, 5098, 5096, 3043, 5097, 5097, 5097,
  /*   72 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097,
  /*   90 */ 5097, 5097, 5097, 5097, 5097, 5097, 2144, 2149, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  108 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  126 */ 5097, 5097, 5722, 2165, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  144 */ 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3302, 3213,
  /*  162 */ 2566, 5096, 3043, 5097, 5097, 2524, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 6126, 2515,
  /*  180 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5505, 2191, 5098, 5096, 3043, 5097,
  /*  198 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097,
  /*  216 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097,
  /*  234 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  252 */ 5097, 5097, 5097, 5097, 5097, 2217, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  270 */ 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  288 */ 5097, 2250, 5098, 5096, 3043, 2283, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  306 */ 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 4159, 2898, 5098, 5097,
  /*  324 */ 3043, 5097, 5097, 4359, 5097, 5097, 5097, 3847, 5097, 5097, 5097, 5097, 5097, 5097, 2234, 2441, 5097, 5097,
  /*  342 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3223, 2302, 5098, 5096, 3043, 5097, 5097, 5097,
  /*  360 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  378 */ 5097, 5097, 5097, 5097, 5097, 5097, 2329, 2358, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  396 */ 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  414 */ 5097, 5097, 5097, 2385, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  432 */ 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2939, 2429,
  /*  450 */ 6043, 5096, 3043, 2822, 5097, 3245, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441,
  /*  468 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2369, 2466, 5098, 5096, 3043, 5097,
  /*  486 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097,
  /*  504 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2342, 2503, 4939, 2540, 3043, 2594, 5097, 3245, 5097, 5097,
  /*  522 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  540 */ 5097, 5097, 5097, 5097, 2227, 2396, 5098, 2563, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  558 */ 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  576 */ 2643, 2582, 5098, 5096, 2197, 4982, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  594 */ 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3378, 2610, 3265, 2636,
  /*  612 */ 3357, 5365, 2735, 4247, 2286, 3472, 2735, 4122, 5149, 2734, 5218, 2659, 2735, 2697, 3628, 5029, 5097, 5097,
  /*  630 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3378, 2610, 3265, 2636, 3357, 5365, 2735, 4247,
  /*  648 */ 2286, 3472, 2735, 3589, 5149, 2734, 5001, 3731, 2735, 2725, 3628, 3293, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  666 */ 5097, 5097, 5097, 5097, 5097, 5097, 3378, 2610, 3265, 2636, 3357, 5365, 2735, 3926, 2286, 3472, 2735, 3589,
  /*  684 */ 5149, 2734, 5001, 3731, 2735, 2725, 3628, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  702 */ 5097, 5097, 3378, 2610, 3265, 2636, 3357, 5365, 2735, 3926, 2286, 3472, 2735, 3589, 5149, 2734, 5001, 3731,
  /*  720 */ 2735, 2751, 4922, 4350, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3378, 2610,
  /*  738 */ 3265, 2636, 3357, 5365, 2735, 5386, 2286, 3472, 2735, 3515, 5149, 2734, 5001, 3731, 2735, 2725, 3628, 3293,
  /*  756 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 4934, 2855, 5098, 5096, 3043, 5097,
  /*  774 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097,
  /*  792 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5343, 2776, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097,
  /*  810 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  828 */ 5097, 5097, 5097, 5097, 5097, 2809, 5098, 5096, 3043, 2260, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  846 */ 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  864 */ 5097, 2842, 5098, 5096, 3093, 2883, 5097, 5097, 5097, 2413, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  882 */ 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2925, 4579, 5096,
  /*  900 */ 3043, 3653, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097,
  /*  918 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2955, 5098, 5096, 3043, 5097, 5097, 5097,
  /*  936 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  954 */ 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285, 2735, 5199, 2286, 3472, 2735, 5178,
  /*  972 */ 5149, 2734, 5001, 3731, 2735, 2725, 3628, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /*  990 */ 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285, 2735, 5199, 2286, 3472, 2735, 5178, 5149, 2734, 5001, 3731,
  /* 1008 */ 2735, 2725, 5084, 4150, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805,
  /* 1026 */ 3265, 3010, 3357, 2285, 2735, 5199, 2286, 3472, 2735, 3452, 5149, 2734, 5001, 3731, 2735, 2725, 3628, 3293,
  /* 1044 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285,
  /* 1062 */ 2735, 5199, 2286, 3472, 2735, 3895, 5149, 2734, 3264, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097,
  /* 1080 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 4005, 3029, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097,
  /* 1098 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1116 */ 5097, 5097, 5097, 5097, 5097, 5097, 3063, 3062, 3043, 5097, 5097, 5038, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1134 */ 5097, 5097, 5097, 5097, 2267, 2478, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1152 */ 2175, 3079, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1170 */ 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3109, 5098, 5096,
  /* 1188 */ 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097,
  /* 1206 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3152, 3168, 3199, 3239, 6107, 2285, 3261, 3281,
  /* 1224 */ 4749, 4606, 3318, 3343, 3369, 3394, 5001, 3731, 2735, 2725, 3628, 3293, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1242 */ 5097, 5097, 5097, 5097, 5097, 5097, 3425, 3441, 3265, 5146, 3357, 2285, 2735, 3823, 2286, 3472, 3468, 5178,
  /* 1260 */ 6119, 4188, 5001, 3731, 2735, 2725, 3619, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1278 */ 5097, 5097, 3488, 3504, 3265, 5146, 3357, 2285, 2735, 5199, 2286, 3472, 2735, 5178, 5149, 2734, 5535, 3731,
  /* 1296 */ 2708, 3531, 5084, 4150, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3562, 3578,
  /* 1314 */ 3265, 5146, 3357, 2285, 2735, 5199, 2286, 3472, 2735, 2994, 3013, 2760, 5286, 3731, 2735, 3605, 6178, 3644,
  /* 1332 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3669, 3685, 5581, 3701, 6009, 2285,
  /* 1350 */ 3758, 5199, 2286, 3472, 4908, 3776, 3839, 6071, 3863, 3791, 3879, 3915, 3942, 3996, 5097, 5097, 5097, 5097,
  /* 1368 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 4021, 4037, 4778, 5146, 3123, 2285, 4064, 3823, 2286, 3472,
  /* 1386 */ 2735, 5178, 5149, 2734, 5001, 3731, 2709, 2725, 3619, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1404 */ 5097, 5097, 5097, 5097, 4085, 4101, 3265, 5146, 3357, 2285, 3760, 4138, 2487, 4175, 4816, 3895, 5817, 3815,
  /* 1422 */ 4069, 2681, 4239, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1440 */ 3970, 4209, 5791, 4263, 6156, 2285, 2735, 5199, 2286, 3472, 2735, 3895, 5149, 2734, 3264, 2670, 2707, 2793,
  /* 1458 */ 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 4279, 4295, 3183, 4322,
  /* 1476 */ 4458, 2285, 2735, 4338, 2826, 5408, 4649, 4375, 4405, 3980, 4395, 3742, 4421, 5604, 4444, 3293, 5097, 5097,
  /* 1494 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285, 2735, 5199,
  /* 1512 */ 2286, 3472, 2735, 3895, 5149, 2706, 3264, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1530 */ 5097, 5097, 5097, 5097, 5097, 5097, 4487, 4503, 4530, 4546, 4705, 2285, 5451, 5566, 2201, 5637, 4815, 5498,
  /* 1548 */ 4576, 2734, 3264, 5844, 4595, 2793, 4718, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1566 */ 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285, 2735, 5199, 2286, 3472, 5632, 3895, 5149, 2734, 3264, 2670,
  /* 1584 */ 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 4622, 4638,
  /* 1602 */ 4675, 4691, 4734, 2285, 4765, 3823, 2969, 4794, 3327, 3895, 4379, 2620, 6077, 2670, 4112, 2867, 6169, 3293,
  /* 1620 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 4832, 4848, 4864, 3716, 2285,
  /* 1638 */ 4306, 5199, 2909, 4894, 2735, 4955, 4978, 4998, 3889, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097,
  /* 1656 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285, 2735, 5017, 2286, 3472,
  /* 1674 */ 2735, 3895, 5149, 2734, 3264, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1692 */ 5097, 5097, 5097, 5097, 5054, 5070, 5920, 5114, 3357, 2285, 4813, 5136, 2286, 4514, 4193, 3895, 6021, 5168,
  /* 1710 */ 5194, 5866, 5215, 2793, 4471, 5234, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1728 */ 5259, 5275, 3265, 5146, 3357, 2285, 5302, 5322, 5120, 4428, 3323, 3895, 5359, 4807, 5381, 5855, 5402, 2793,
  /* 1746 */ 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5424, 5440, 3409, 5467,
  /* 1764 */ 4560, 3046, 4224, 3823, 5483, 5521, 5551, 5597, 3899, 2982, 5306, 5877, 5620, 2313, 6169, 3293, 5097, 5097,
  /* 1782 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5653, 5669, 5698, 5714, 6222, 2285, 5738, 5761,
  /* 1800 */ 2789, 5777, 5745, 4659, 5149, 2734, 5807, 5833, 2735, 2793, 3136, 5334, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1818 */ 5097, 5097, 5097, 5097, 5097, 5097, 5893, 5909, 3265, 5146, 3357, 2285, 2735, 5199, 2286, 3472, 2735, 3895,
  /* 1836 */ 5149, 2734, 3264, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1854 */ 5097, 5097, 5936, 5952, 3546, 5146, 3956, 2285, 2735, 5199, 2286, 3472, 2735, 3895, 5149, 2734, 3264, 2670,
  /* 1872 */ 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805,
  /* 1890 */ 5979, 5995, 4878, 2285, 2735, 4048, 2286, 3472, 2735, 3895, 5149, 2734, 3264, 2670, 2735, 2793, 3136, 3293,
  /* 1908 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805, 5963, 6037, 3357, 2285,
  /* 1926 */ 2735, 5199, 2286, 3472, 2735, 3895, 5149, 2734, 3264, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097,
  /* 1944 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 3970, 3805, 3265, 5146, 3357, 2285, 2735, 6059, 2286, 5682,
  /* 1962 */ 2735, 3895, 5149, 2734, 3264, 2670, 2735, 2793, 3136, 3293, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1980 */ 5097, 5097, 5097, 5097, 5243, 6093, 5098, 5096, 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 1998 */ 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 2016 */ 5097, 6142, 5098, 5096, 3043, 4962, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 2034 */ 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2407, 6208, 5098, 5096,
  /* 2052 */ 3043, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097,
  /* 2070 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2450, 6194, 5098, 5096, 3043, 5097, 5097, 5097,
  /* 2088 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 2547, 2441, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 2106 */ 5097, 5097, 5097, 5097, 5097, 5097, 5152, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 2124 */ 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097, 5097,
  /* 2142 */ 5097, 5097, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171, 6171,
  /* 2160 */ 0, 0, 0, 0, 0, 80, 6656, 80, 80, 80, 80, 80, 80, 6736, 6736, 0, 0, 0, 0, 0, 0, 0, 25088, 0, 0, 0, 0, 0,
  /* 2188 */ 25088, 0, 25088, 0, 5699, 0, 0, 0, 0, 0, 0, 5699, 5699, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 209, 2076,
  /* 2216 */ 2076, 7761, 0, 7761, 7761, 7761, 7761, 7761, 7761, 7761, 7761, 0, 0, 0, 0, 0, 0, 16384, 0, 0, 0, 0, 0, 0,
  /* 2240 */ 0, 0, 0, 0, 0, 48, 0, 4218, 0, 0, 8786, 0, 8786, 8786, 8786, 8786, 8786, 8786, 8786, 8786, 0, 0, 0, 0, 0,
  /* 2265 */ 0, 19613, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 309, 0, 188, 0, 0, 0, 9216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 2297 */ 0, 0, 0, 2076, 2076, 0, 10240, 0, 0, 0, 10240, 10240, 10240, 10240, 10240, 0, 0, 0, 0, 0, 0, 294, 0, 0, 0,
  /* 2322 */ 0, 2076, 2076, 2345, 2076, 2076, 2076, 0, 10752, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10752, 0, 0, 0, 46, 0, 0,
  /* 2348 */ 47, 0, 50, 55, 0, 55, 55, 55, 55, 55, 10752, 10752, 0, 0, 0, 10752, 0, 0, 10752, 10752, 0, 0, 0, 0, 0, 0,
  /* 2374 */ 13824, 0, 13824, 0, 0, 0, 0, 0, 0, 0, 13824, 11347, 0, 11347, 11347, 11347, 11347, 11347, 11347, 11347,
  /* 2394 */ 11347, 0, 0, 0, 0, 0, 0, 16384, 16384, 16384, 0, 16384, 0, 0, 0, 0, 0, 0, 36352, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 2422 */ 0, 0, 0, 19968, 23552, 0, 0, 12372, 45, 12372, 12372, 12372, 12372, 12372, 12372, 12372, 12372, 0, 0, 0, 0,
  /* 2443 */ 0, 0, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36864, 0, 36864, 36864, 36864, 36864, 36864, 0, 13824,
  /* 2468 */ 13824, 13824, 13824, 0, 13824, 13824, 13824, 13824, 0, 0, 0, 0, 0, 0, 309, 121, 121, 121, 121, 0, 0, 0, 0,
  /* 2491 */ 0, 0, 0, 0, 203, 0, 205, 0, 0, 0, 2076, 2076, 14421, 55, 14421, 14421, 14421, 14428, 14428, 14428, 14429,
  /* 2512 */ 14431, 0, 0, 0, 0, 0, 0, 4656, 4608, 4608, 4608, 4608, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 122, 0, 0, 0, 0, 0,
  /* 2540 */ 122, 0, 0, 0, 0, 0, 14848, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 122, 0, 124, 0, 0, 0, 0, 0, 0,
  /* 2572 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4608, 16982, 68, 16982, 16982, 16982, 16982, 16982, 16982, 16990, 16990, 0, 0,
  /* 2594 */ 0, 0, 0, 0, 14848, 0, 0, 0, 0, 0, 0, 14848, 14848, 0, 14848, 0, 0, 5171, 0, 0, 0, 0, 0, 0, 5171, 5171, 0,
  /* 2621 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2310, 2076, 2076, 2076, 2076, 2076, 122, 5171, 5171,
  /* 2639 */ 2076, 2076, 2076, 5171, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 68, 68, 68, 68, 68, 274, 275, 190, 122, 2076, 0,
  /* 2665 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 281, 0, 2076,
  /* 2697 */ 240, 292, 244, 0, 0, 0, 0, 0, 0, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 2719 */ 2076, 2076, 28, 2076, 2076, 2076, 240, 0, 244, 0, 0, 0, 0, 0, 0, 0, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 2741 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 291, 0, 293, 0, 0, 0, 0, 0, 0, 0, 2076, 2076,
  /* 2763 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 33308, 2076, 2076, 0, 18432, 0, 0, 18432, 0, 0,
  /* 2783 */ 18432, 18432, 18432, 0, 0, 0, 0, 0, 0, 199, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2076, 2076, 2076, 2076, 2076,
  /* 2808 */ 2076, 19031, 0, 19031, 19031, 19031, 19031, 19031, 19031, 19031, 19031, 0, 0, 0, 0, 0, 0, 12800, 0, 0, 0,
  /* 2829 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 208, 2076, 2076, 21080, 0, 21080, 21080, 21080, 21080, 21080, 21080, 21080,
  /* 2851 */ 21080, 0, 0, 0, 0, 0, 0, 17920, 0, 0, 17920, 0, 17920, 17920, 0, 0, 0, 0, 0, 0, 28672, 0, 0, 0, 295, 0,
  /* 2877 */ 2076, 28700, 2076, 2076, 2076, 2346, 8192, 9728, 11776, 13312, 15360, 17408, 20480, 21504, 22528, 26112,
  /* 2893 */ 35328, 15360, 15360, 17408, 15360, 0, 49, 0, 0, 0, 0, 0, 0, 49, 49, 0, 0, 0, 0, 0, 0, 201, 0, 0, 0, 204, 0,
  /* 2920 */ 0, 0, 0, 2076, 2076, 22105, 0, 22105, 22105, 22105, 22105, 22105, 22105, 22105, 22105, 0, 0, 0, 0, 0, 0,
  /* 2941 */ 45, 0, 0, 0, 0, 0, 0, 45, 0, 45, 45, 45, 45, 45, 24064, 0, 24064, 24064, 24064, 24064, 24064, 24064, 24064,
  /* 2964 */ 24064, 0, 0, 0, 0, 0, 0, 198, 0, 0, 0, 0, 202, 0, 0, 0, 0, 0, 0, 2076, 2076, 2273, 2076, 2076, 2076, 2076,
  /* 2990 */ 2076, 2076, 2076, 2311, 2076, 2076, 2076, 2076, 28, 2076, 2076, 239, 240, 0, 0, 0, 243, 244, 0, 0, 122, 0,
  /* 3012 */ 125, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33280, 0, 24576, 0, 0, 0, 24576, 24576, 24576,
  /* 3037 */ 24576, 24576, 0, 0, 0, 0, 0, 0, 5699, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2207, 123, 0, 0, 0, 0,
  /* 3067 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 121, 0, 25088, 0, 0, 25088, 0, 0, 25088, 25088, 25088, 0, 0, 0, 0, 0, 0,
  /* 3095 */ 5699, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7168, 25690, 0, 25690, 25690, 25690, 25690, 25690, 25690, 25690,
  /* 3118 */ 25690, 0, 0, 0, 0, 0, 0, 5699, 0, 2076, 2076, 2076, 2076, 2076, 28, 2076, 2076, 2076, 2076, 2076, 0, 0, 0,
  /* 3141 */ 0, 0, 0, 2076, 2076, 2076, 48, 0, 0, 0, 0, 2077, 0, 0, 0, 0, 0, 0, 0, 2077, 2077, 56, 2117, 2117, 2117,
  /* 3166 */ 2117, 2117, 0, 2117, 0, 0, 0, 0, 0, 0, 2117, 2117, 0, 2076, 2076, 2076, 2146, 2076, 2076, 2076, 2076, 2076,
  /* 3188 */ 2076, 2076, 2161, 2076, 2076, 2076, 2076, 0, 0, 0, 48, 2076, 2153, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 3207 */ 2076, 2076, 2076, 2076, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 10240, 0, 10240, 10240, 0,
  /* 3234 */ 10240, 10240, 10240, 10240, 10240, 122, 0, 0, 2174, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0,
  /* 3259 */ 0, 0, 2076, 2076, 2155, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0,
  /* 3279 */ 0, 48, 2076, 2223, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 2076, 2076, 2076, 48, 48, 48, 48, 48,
  /* 3302 */ 0, 0, 0, 0, 0, 0, 0, 0, 48, 48, 0, 48, 48, 48, 48, 48, 2076, 2076, 2274, 2076, 2076, 2076, 2156, 2076,
  /* 3326 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2277, 2076, 2076, 2076, 2076,
  /* 3344 */ 2076, 2076, 2076, 2076, 2285, 2076, 239, 240, 0, 0, 0, 243, 244, 0, 0, 5699, 0, 2076, 2076, 2076, 2076,
  /* 3365 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 249, 0, 0, 0, 0, 0, 0, 0, 0, 5171, 5171, 0, 5171,
  /* 3390 */ 5171, 5171, 5171, 5171, 255, 2076, 2076, 2076, 2076, 2076, 2307, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 3408 */ 2313, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2162, 2076, 2076, 2076, 2076, 0, 0, 0, 48, 2078, 0, 0, 0,
  /* 3429 */ 0, 0, 0, 0, 2078, 2078, 0, 2078, 2078, 2078, 2078, 2078, 0, 2078, 0, 0, 0, 0, 0, 0, 2078, 2078, 0, 2076,
  /* 3453 */ 2076, 2076, 2076, 2076, 2076, 2076, 239, 240, 0, 0, 0, 243, 244, 125, 0, 2076, 2076, 2076, 2231, 2076,
  /* 3473 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 2076, 2076, 2079, 0, 0, 0, 0, 0, 0,
  /* 3495 */ 0, 2079, 2079, 57, 2118, 2118, 2118, 2118, 2118, 0, 2118, 0, 0, 0, 0, 0, 0, 2118, 2118, 0, 2076, 2076,
  /* 3517 */ 2076, 2076, 2076, 2076, 2076, 239, 240, 0, 0, 0, 243, 244, 5311, 5312, 240, 0, 244, 0, 0, 0, 0, 32256, 0,
  /* 3540 */ 0, 2076, 2076, 2076, 2076, 32284, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2163, 2076, 2076, 2076, 2076,
  /* 3558 */ 0, 0, 0, 48, 2080, 0, 0, 0, 0, 0, 0, 0, 2080, 2080, 58, 2119, 2119, 2119, 2119, 2119, 0, 2119, 0, 0, 0, 0,
  /* 3584 */ 0, 0, 2119, 2119, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 239, 240, 187, 122, 0, 243, 244, 5311, 5312,
  /* 3605 */ 240, 0, 244, 0, 0, 0, 31744, 0, 0, 0, 2076, 2076, 2076, 31772, 2076, 2076, 48, 0, 122, 0, 0, 0, 2076, 2076,
  /* 3629 */ 2076, 48, 0, 122, 0, 0, 0, 2076, 2076, 2076, 48, 0, 0, 0, 0, 0, 2076, 32796, 2076, 48, 48, 48, 48, 48, 0,
  /* 3654 */ 0, 0, 0, 0, 0, 0, 0, 23198, 0, 0, 15872, 0, 0, 15872, 0, 2081, 0, 0, 0, 0, 0, 0, 0, 2081, 2081, 59, 2120,
  /* 3681 */ 2120, 2120, 2120, 2120, 0, 2120, 0, 0, 0, 0, 0, 0, 2120, 2120, 0, 2076, 2076, 2076, 2076, 2149, 122, 0,
  /* 3703 */ 125, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 142, 5699, 0, 2076, 2193, 146, 2076, 2155, 2076,
  /* 3726 */ 2198, 2076, 2076, 2076, 2204, 0, 190, 190, 122, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2076, 0, 0, 0, 0, 0, 0,
  /* 3753 */ 0, 280, 0, 0, 2076, 2208, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 3772 */ 2076, 2076, 2218, 2076, 2076, 2282, 2076, 2076, 2076, 2076, 2076, 239, 240, 0, 0, 0, 243, 244, 125, 0, 190,
  /* 3793 */ 190, 122, 3612, 0, 0, 0, 0, 0, 0, 279, 0, 0, 0, 2076, 0, 0, 0, 0, 0, 0, 2076, 2076, 0, 2076, 2076, 2076,
  /* 3819 */ 2076, 2076, 2076, 30236, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 48, 0, 122, 0, 0, 2076, 2076,
  /* 3838 */ 2076, 2076, 2076, 3100, 0, 0, 0, 0, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4096, 4096, 4096, 0, 0, 0, 0, 2076,
  /* 3864 */ 2076, 2076, 2076, 2229, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 185, 185, 48, 2076, 2076, 2076,
  /* 3882 */ 2076, 2076, 2334, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2317, 2076, 2076, 2076, 2076, 2076,
  /* 3900 */ 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 0, 0, 240, 0, 244, 28160, 0, 0, 0, 0, 0, 0, 28188, 2076,
  /* 3927 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 48, 0, 187, 5311, 5312, 2076, 2076, 2076, 2076, 2155, 48, 0, 122,
  /* 3947 */ 303, 304, 0, 2354, 2355, 2076, 48, 0, 0, 0, 0, 5699, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 3968 */ 2163, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 2076, 2076, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2308, 2076,
  /* 3990 */ 2076, 2076, 2312, 2076, 2076, 2076, 33792, 2076, 2076, 33820, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 4013 */ 24576, 24576, 0, 24576, 24576, 24576, 24576, 24576, 2082, 0, 0, 0, 0, 0, 0, 0, 2100, 2100, 60, 2121, 2121,
  /* 4034 */ 2121, 2121, 2121, 0, 2121, 0, 0, 0, 0, 0, 0, 2121, 2121, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4056 */ 185, 0, 190, 0, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2211, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4075 */ 2076, 2076, 2076, 2076, 2076, 2221, 2076, 0, 0, 0, 2083, 0, 0, 0, 0, 0, 0, 0, 2083, 2083, 0, 2083, 2083,
  /* 4098 */ 2083, 2083, 2083, 0, 2083, 0, 0, 0, 0, 0, 0, 2083, 2083, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4120 */ 2076, 2164, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 238, 240, 187, 122, 0, 242, 244, 5311, 5312, 2221,
  /* 4139 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 2076, 2076, 2076, 48, 48, 48, 48, 300, 0, 0, 0, 0,
  /* 4163 */ 0, 0, 0, 0, 49, 49, 0, 49, 49, 49, 49, 49, 2076, 2076, 2076, 2076, 2076, 2076, 2265, 2076, 2267, 2076,
  /* 4185 */ 2076, 2076, 0, 0, 2076, 2076, 2076, 2305, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4204 */ 2156, 2076, 2076, 2076, 2076, 0, 2076, 0, 0, 0, 0, 0, 0, 2076, 2076, 0, 2076, 2076, 2076, 2147, 2076, 2076,
  /* 4226 */ 2076, 2076, 2076, 2076, 2076, 2214, 2076, 2076, 2076, 28, 2076, 2076, 2219, 2076, 2076, 2076, 2076, 2076,
  /* 4244 */ 2076, 2076, 2336, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 48, 0, 186, 5311, 5312, 2076, 2076, 2076,
  /* 4263 */ 122, 0, 0, 2076, 2076, 2076, 0, 0, 130, 0, 0, 0, 0, 0, 0, 138, 2084, 0, 0, 0, 0, 0, 0, 0, 2084, 2084, 61,
  /* 4290 */ 2122, 2122, 2122, 2122, 2122, 0, 2122, 0, 0, 0, 0, 0, 0, 2122, 2122, 0, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4312 */ 2076, 2076, 2076, 2215, 2076, 2076, 2076, 2076, 2076, 2220, 122, 0, 0, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0,
  /* 4334 */ 0, 0, 0, 139, 2076, 2076, 2225, 2076, 2076, 2227, 2229, 2231, 0, 0, 0, 0, 0, 2076, 2076, 2076, 48, 48, 48,
  /* 4357 */ 313, 48, 0, 0, 0, 0, 0, 0, 0, 0, 48, 4096, 122, 0, 0, 0, 0, 0, 2076, 2076, 2076, 2284, 2076, 2076, 2076, 0,
  /* 4383 */ 0, 0, 0, 0, 0, 0, 0, 0, 252, 0, 0, 0, 2314, 2076, 2076, 2076, 2076, 2076, 2318, 2076, 2076, 2076, 2076,
  /* 4406 */ 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 250, 0, 0, 0, 254, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2335, 2076,
  /* 4429 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2269, 2076, 0, 0, 2076, 2076, 2347, 2076, 0, 0, 0, 0,
  /* 4450 */ 0, 0, 2076, 2076, 2076, 48, 0, 0, 0, 0, 5699, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2201,
  /* 4471 */ 2076, 2076, 0, 0, 0, 0, 0, 0, 2076, 2076, 2076, 48, 0, 122, 30720, 0, 2085, 0, 0, 0, 0, 0, 0, 0, 2085,
  /* 4496 */ 2085, 62, 2123, 2123, 2123, 2123, 2123, 0, 2123, 0, 0, 0, 0, 0, 0, 2123, 2123, 0, 2076, 2076, 2076, 2076,
  /* 4518 */ 2076, 2076, 2076, 2076, 2076, 2224, 2076, 2076, 0, 0, 2076, 2076, 2146, 2154, 2076, 2076, 2076, 2076, 2076,
  /* 4537 */ 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 48, 122, 0, 0, 2154, 2076, 2076, 0, 0, 0, 0, 0, 134, 0, 0, 0, 0,
  /* 4562 */ 5699, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2202, 2076, 2076, 0, 2076, 2588, 2076, 0, 0, 0, 0,
  /* 4583 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15872, 48, 2331, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2156,
  /* 4606 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2268, 2076, 2076, 0, 0, 2076, 2272, 2086, 0, 0, 0, 0,
  /* 4627 */ 0, 0, 0, 2101, 2101, 0, 2101, 2101, 2101, 2101, 2101, 0, 2101, 0, 0, 0, 0, 0, 0, 2101, 2101, 0, 2076, 2076,
  /* 4651 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2276, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 184, 0, 0, 0,
  /* 4670 */ 241, 189, 0, 0, 0, 2151, 2076, 2076, 2156, 2076, 2076, 2076, 2076, 2076, 2166, 2076, 2076, 0, 0, 0, 48,
  /* 4691 */ 122, 0, 0, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 135, 0, 0, 0, 5699, 0, 2076, 2076, 2076, 2146, 2196, 2076,
  /* 4715 */ 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 305, 2076, 2076, 2356, 48, 0, 0, 0, 0, 141, 0, 5699, 0, 2076,
  /* 4739 */ 2076, 2076, 2151, 2076, 2197, 2076, 2076, 2076, 2203, 2076, 0, 197, 0, 0, 0, 0, 0, 0, 0, 0, 0, 206, 0, 0,
  /* 4763 */ 2076, 2259, 2076, 2076, 2076, 2210, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2216, 2076, 2076, 2076,
  /* 4781 */ 28, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 48, 2260, 2076, 2076, 2076, 2076, 2264, 2076,
  /* 4801 */ 2076, 2076, 2076, 2076, 2076, 0, 0, 2076, 2076, 2304, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4820 */ 2076, 2076, 2076, 28, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 2076, 0, 0, 0, 0, 0, 0, 2076,
  /* 4841 */ 2076, 0, 2076, 2076, 2076, 2148, 102, 2076, 2155, 2144, 2076, 2157, 2076, 2076, 2076, 2076, 2076, 2167,
  /* 4859 */ 2076, 0, 0, 0, 48, 122, 0, 0, 2155, 2076, 2076, 0, 0, 131, 132, 0, 0, 0, 136, 0, 0, 5699, 0, 2076, 2076,
  /* 4884 */ 2076, 2195, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 2076, 2076, 2076, 2263, 2076, 2076, 2076, 2266,
  /* 4902 */ 2076, 2076, 2076, 2076, 0, 0, 28, 2076, 2076, 2076, 2076, 2275, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 4921 */ 2278, 2076, 2076, 48, 301, 122, 0, 0, 0, 2076, 2076, 2076, 48, 0, 0, 0, 0, 17920, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 4947 */ 0, 0, 0, 0, 0, 14848, 0, 48, 2076, 2076, 2283, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35840,
  /* 4973 */ 0, 0, 0, 0, 0, 2076, 2076, 2076, 26624, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5699, 0, 0, 0, 26652, 2076,
  /* 5001 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 185, 185, 48, 2076, 2076,
  /* 5019 */ 2076, 2076, 2226, 2076, 2076, 2076, 0, 0, 0, 0, 0, 2076, 2076, 2076, 48, 311, 312, 48, 48, 0, 0, 0, 0, 0,
  /* 5043 */ 0, 0, 0, 48, 0, 188, 0, 0, 0, 0, 0, 2087, 0, 0, 0, 0, 0, 0, 0, 2087, 2087, 63, 2124, 2124, 2124, 2124,
  /* 5069 */ 2124, 0, 2124, 0, 0, 0, 0, 0, 0, 2124, 2124, 0, 2076, 2076, 2145, 2076, 2076, 300, 0, 302, 0, 0, 0, 2076,
  /* 5093 */ 2076, 2076, 48, 122, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 122, 0, 0, 2076, 2076, 2176, 0, 0,
  /* 5122 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 207, 0, 2076, 2076, 2076, 2224, 2076, 2076, 2076, 2076, 2076, 2076, 48, 0,
  /* 5146 */ 122, 0, 0, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1536, 0, 0, 2076, 27164, 2076, 2076,
  /* 5173 */ 2076, 2076, 2076, 2076, 2309, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 239, 240, 0, 0, 0, 243, 244, 0, 0,
  /* 5194 */ 2076, 2076, 2283, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 2076, 2076,
  /* 5214 */ 2076, 2076, 2332, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 273,
  /* 5232 */ 185, 48, 0, 30748, 2076, 2076, 48, 48, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0, 34304, 34304, 0, 34304, 34304,
  /* 5256 */ 34304, 34304, 34304, 2088, 0, 0, 0, 0, 0, 0, 0, 2088, 2088, 64, 2125, 2125, 2125, 2125, 2125, 0, 2125, 0,
  /* 5278 */ 0, 0, 0, 0, 0, 2125, 2125, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2320, 2076, 2076, 2076,
  /* 5299 */ 185, 185, 48, 2076, 2209, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 5317 */ 2076, 2168, 0, 0, 0, 2076, 2076, 2076, 2076, 2076, 2228, 2076, 2076, 0, 0, 0, 0, 0, 2076, 2076, 2076, 310,
  /* 5339 */ 310, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 18432, 0, 0, 0, 18432, 18432, 18432, 18432, 18432, 2293, 2076, 2076,
  /* 5362 */ 0, 0, 246, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5171, 0, 5171, 2076, 2076, 2076, 2076, 2316, 2076, 2076,
  /* 5387 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 5311, 5312, 2076, 2076, 2076, 2076, 2076, 2076, 2333,
  /* 5406 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2227, 2270, 0, 0, 2076, 2076, 2089,
  /* 5425 */ 0, 0, 0, 0, 0, 0, 0, 2102, 2102, 0, 2102, 2102, 2102, 2102, 2102, 0, 2102, 0, 0, 0, 0, 0, 0, 2102, 2102, 0,
  /* 5451 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2146, 2076, 2076, 2076, 2076, 2217, 2076, 2076, 122, 0, 0,
  /* 5470 */ 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 140, 196, 0, 0, 0, 200, 0, 29696, 0, 0, 0, 0, 0, 0, 0, 2258,
  /* 5498 */ 2076, 2076, 2076, 2076, 2076, 2076, 2209, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5699, 5699, 5699, 5699, 5699,
  /* 5521 */ 2076, 2076, 2262, 2076, 29724, 2076, 2219, 2076, 2076, 2076, 2076, 2076, 0, 0, 2076, 2076, 2076, 2076,
  /* 5539 */ 2076, 2076, 2076, 2156, 2319, 2076, 2076, 2076, 2076, 185, 185, 48, 2076, 2273, 2076, 2076, 2076, 2076,
  /* 5557 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2279, 2076, 2076, 2076, 2076, 2076, 2076, 2230, 2076, 0, 0,
  /* 5576 */ 0, 0, 0, 2241, 2242, 2076, 2076, 2076, 2076, 2076, 2076, 2159, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 48,
  /* 5597 */ 2281, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 296, 2076, 2076, 2076, 2076, 2076,
  /* 5619 */ 2076, 2076, 2076, 29212, 2076, 31260, 2076, 2076, 2076, 2337, 2076, 2076, 2338, 2076, 2076, 2076, 2076, 28,
  /* 5637 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2271, 0, 0, 2076, 2076, 2090, 0, 0, 0, 0,
  /* 5658 */ 0, 0, 0, 2090, 2090, 65, 2126, 2126, 2126, 2126, 2126, 0, 2126, 0, 0, 0, 0, 0, 0, 2126, 2126, 0, 2076,
  /* 5681 */ 2144, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2222, 2076, 2076, 2076, 0, 0, 2076, 2076, 2076, 2076,
  /* 5700 */ 2076, 2076, 2076, 2158, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 48, 122, 0, 0, 2076, 2175, 2076, 0,
  /* 5721 */ 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6656, 0, 6656, 6656, 6656, 6656, 6656, 2076, 2076, 2076, 2076, 2076, 2212,
  /* 5744 */ 2213, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2275, 2076, 2076, 2076, 2076, 2280, 2076,
  /* 5762 */ 2076, 2076, 2209, 2076, 2076, 2076, 2076, 184, 0, 189, 0, 0, 2076, 2076, 2243, 2076, 2261, 2076, 2076,
  /* 5781 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2160, 2076,
  /* 5800 */ 2076, 2076, 2168, 0, 0, 0, 48, 2076, 2315, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 5819 */ 2076, 0, 0, 0, 0, 0, 0, 30208, 0, 0, 0, 0, 0, 0, 241, 0, 0, 0, 2076, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2076, 0,
  /* 5850 */ 276, 0, 0, 0, 0, 0, 0, 0, 0, 2076, 0, 0, 0, 0, 278, 0, 0, 0, 0, 0, 2076, 0, 0, 277, 0, 0, 0, 0, 0, 0, 0,
  /* 5881 */ 2076, 27648, 0, 0, 29184, 0, 31232, 0, 0, 0, 282, 27676, 2091, 0, 0, 0, 0, 0, 0, 0, 2091, 2091, 66, 2127,
  /* 5905 */ 2127, 2127, 2127, 2127, 0, 2127, 0, 0, 0, 0, 0, 0, 2127, 2127, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 5927 */ 2076, 2164, 2076, 2076, 2076, 0, 0, 0, 48, 2092, 0, 0, 0, 0, 0, 0, 0, 2092, 2092, 0, 2092, 2092, 2092,
  /* 5950 */ 2092, 2092, 0, 2092, 0, 0, 0, 0, 0, 0, 2092, 2092, 0, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2165,
  /* 5972 */ 2076, 2076, 2076, 0, 0, 0, 48, 2152, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0,
  /* 5992 */ 0, 0, 48, 122, 0, 0, 2076, 2076, 2076, 0, 0, 0, 0, 133, 0, 0, 0, 0, 0, 5699, 0, 2076, 2076, 2149, 2076,
  /* 6017 */ 2076, 2076, 2076, 2199, 2076, 2076, 2076, 0, 27136, 0, 0, 0, 0, 0, 0, 251, 0, 0, 0, 0, 122, 0, 0, 2076,
  /* 6041 */ 2076, 2165, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12800, 0, 0, 48, 2222, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 6066 */ 2076, 0, 0, 0, 0, 0, 2076, 2076, 2076, 2076, 2306, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076,
  /* 6086 */ 2076, 28, 2076, 2076, 0, 0, 0, 0, 34304, 0, 0, 0, 0, 0, 0, 34304, 34304, 0, 0, 0, 0, 0, 0, 5699, 0, 2076,
  /* 6112 */ 2146, 2076, 2076, 2174, 2076, 2076, 2076, 2076, 2076, 2076, 0, 0, 0, 247, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 6137 */ 4656, 0, 122, 0, 0, 34907, 0, 34907, 34907, 34907, 34907, 34907, 34907, 34907, 34907, 0, 0, 0, 0, 0, 0,
  /* 6158 */ 5699, 0, 2076, 2192, 2076, 2076, 2076, 2076, 2076, 2076, 2200, 2076, 2076, 0, 0, 0, 0, 0, 0, 2076, 2076,
  /* 6179 */ 2076, 48, 0, 122, 0, 0, 0, 2076, 2076, 2076, 48, 0, 0, 0, 32768, 0, 36864, 0, 0, 0, 0, 0, 0, 36864, 36864,
  /* 6204 */ 0, 0, 0, 0, 0, 0, 36352, 36352, 0, 0, 36352, 0, 36352, 36352, 0, 0, 0, 0, 0, 0, 5699, 0, 2191, 2076, 2076,
  /* 6229 */ 2076, 2076, 2076, 2076, 2076, 2076, 2076, 2076, 0
];

Operators.EXPECTED =
[
  /*   0 */ 59, 63, 100, 71, 77, 81, 66, 85, 128, 111, 66, 89, 93, 99, 67, 104, 66, 108, 115, 119, 123, 127, 94, 132,
  /*  24 */ 136, 140, 94, 152, 146, 150, 94, 188, 156, 160, 201, 167, 171, 175, 179, 163, 183, 94, 94, 187, 192, 94, 94,
  /*  47 */ 95, 73, 94, 94, 94, 196, 200, 94, 205, 142, 207, 211, 214, 218, 222, 226, 230, 233, 237, 261, 261, 261, 261,
  /*  70 */ 240, 283, 253, 272, 272, 272, 385, 256, 261, 260, 312, 267, 271, 387, 277, 261, 261, 281, 287, 261, 262,
  /*  91 */ 292, 282, 288, 272, 272, 272, 272, 302, 311, 261, 261, 261, 245, 293, 297, 272, 309, 306, 272, 310, 261,
  /* 112 */ 261, 261, 310, 263, 308, 262, 307, 311, 241, 248, 316, 322, 326, 330, 334, 338, 272, 272, 272, 310, 375,
  /* 133 */ 348, 353, 374, 347, 352, 272, 318, 361, 299, 272, 272, 298, 272, 393, 372, 344, 348, 395, 379, 272, 272,
  /* 154 */ 342, 346, 391, 395, 341, 345, 393, 397, 272, 272, 249, 429, 413, 401, 396, 345, 394, 354, 272, 272, 367,
  /* 175 */ 405, 368, 354, 356, 357, 355, 409, 272, 415, 419, 423, 272, 302, 272, 272, 272, 343, 386, 272, 272, 427,
  /* 196 */ 382, 272, 272, 273, 301, 272, 272, 272, 364, 301, 272, 299, 272, 300, 301, 299, 300, 272, 2056, 1050624,
  /* 216 */ 16779264, 268437504, 2048, 67110912, -1073215488, 67110912, 527352, 285744120, 2048, 285745144, 286793720,
  /* 227 */ 285745144, 285745148, 352854008, 1006102528, 353902584, 1072162816, 1072162816, -67115008, -1054720,
  /* 236 */ -1054720, 1073741816, -8, 2048, 8, 256, 256, 256, 256, 16777216, 268435456, 1073741824, 256, 0, 0, 0, 64,
  /* 253 */ 24, 40, 268435968, 0, 0, 1024, 1024, 72, 8, 8, 8, 8, 256, 128, 32768, 393216, 4194304, 50331648, 805306368,
  /* 272 */ 0, 0, 0, 0, 1, 805306880, 1024, 1879048704, 8, 256, 128, 128, 512, 512, 72, 512, 72, 24, 40, 0, 256, 128,
  /* 294 */ 128, 128, 128, 72, 0, 0, 0, 2, 0, 0, 0, 3, 256, 128, 128, 0, 0, 0, 8, 8, 8, 8192, 0, 4, 0, 0, 2, 224, 65544,
  /* 323 */ 32768, 32768, -524288, -491512, -491512, -425976, -491512, -425976, 425971, -425976, 425971, 425975, 491515,
  /* 336 */ 458739, 458743, 524283, -1, -1, 0, 0, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432,
  /* 350 */ 67108864, 134217728, 134217728, 1879048192, 0x80000000, 0, 0, 0, 134217728, 0x80000000, 0, 512, 14336,
  /* 363 */ 262144, 0, 0, 2097152, 4194304, 8388608, 134217728, 536870912, 1073741824, 1073741824, 0x80000000, 0,
  /* 375 */ 524288, 3145728, 4194304, 8388608, 0, 64, 8192, 0, 1, 2, 0, 3, 0, 0, 0, 1879048192, 8388608, 16777216,
  /* 393 */ 67108864, 134217728, 268435456, 536870912, 1073741824, 0x80000000, 0, 0, 8388608, 16777216, 134217728,
  /* 404 */ 268435456, 1073741824, 0x80000000, 0, 4194304, 0x80000000, 0, 134217728, 0x80000000, 3, 135, 135, 135, 56,
  /* 418 */ 135, 120, 120, 56, 56, 120, 56, 255, 255, 48, 0, 0, 0, 4, 132
];

Operators.TOKEN =
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
  "'auto'",
  "'char'",
  "'const'",
  "'double'",
  "'extern'",
  "'float'",
  "'int'",
  "'long'",
  "'register'",
  "'short'",
  "'signed'",
  "'static'",
  "'unsigned'",
  "'void'",
  "'volatile'",
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
    log("Usage: " + command + " Operators.js [-i] INPUT...\n");
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
      var s = new Operators.XmlSerializer(log, indent);
      var parser = new Operators(input, s);
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
