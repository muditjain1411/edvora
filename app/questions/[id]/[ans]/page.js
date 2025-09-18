import React from 'react'

const AnswerPage = (params) => {
    const { id } = params;
    const questionText = `This is the question for ID: ${id}`;
    const answerText = "This is an example answer to demonstrate the answer.";
  return (
      <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6">
          <div>
              <h1 className="text-2xl font-bold mb-2">Question:</h1>
              <p className="mb-6">{questionText}</p>
          </div>
          <div className="answer">
            <p>{answerText} Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, labore. Qui, recusandae reiciendis. Non, voluptate ab ipsa recusandae enim nostrum esse, quo quod nihil aut dignissimos, quas optio aliquam nemo!</p>
          </div>

      </main>
  )
}

export default AnswerPage